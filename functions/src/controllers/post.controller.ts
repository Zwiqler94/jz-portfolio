import { Request, Response, NextFunction } from 'express';
import { error } from 'firebase-functions/logger';
import { DBController } from './db.controller';

interface FeedRow {
  name: string;
}

interface PostInsertRow {
  id: number;
}

const POST_SELECT = `
  SELECT
    post_list.id,
    post_list.type,
    post_list.location,
    post_list.status,
    post_list.content,
    post_list.created_at,
    post_list.updated_at,
    text_post.title,
    link_post.uri,
    link_post.image_uri,
    COALESCE(text_post.title, link_post.uri, post_list.title) AS title_or_uri
  FROM post_list
  INNER JOIN feeds ON feeds.post_id = post_list.id
  LEFT JOIN text_post ON post_list.id = text_post.post_list_id
  LEFT JOIN link_post ON post_list.id = link_post.post_list_id
  WHERE feeds.feed_type = $1
  ORDER BY COALESCE(feeds.created_at, post_list.created_at) DESC, post_list.id DESC
`;

export class PostController {
  constructor(private readonly dbController: DBController) {}

  getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const feedType = String(req.params.feedType ?? '').trim();
      if (!(await this.feedExists(feedType))) {
        res.status(400).json({ error: `Invalid feed type: ${feedType}` });
        return;
      }

      const result = await this.dbController.query(POST_SELECT, [feedType]);
      res.status(200).json(result.rows);
    } catch (err: any) {
      error(err);
      res.status(500).json({ error: err.message });
      next(err);
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        type: rawType,
        location: rawLocation,
        status,
        content,
        title,
      } = req.body;
      const location = String(rawLocation ?? '').trim();
      const type = this.normalizePostType(rawType);

      if (!(await this.feedExists(location))) {
        res.status(400).json({ error: `Invalid feed type: ${location}` });
        return;
      }

      const insertResult = await this.dbController.query<PostInsertRow>(
        `INSERT INTO public.post_list (title, location, status, content, type)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (post_hash) DO NOTHING
         RETURNING id`,
        [title, location, status, this.sanitizeContent(content), type],
      );

      const postId = insertResult.rows[0]?.id;
      if (!postId) {
        res.status(409).json({ error: 'Post already exists' });
        return;
      }

      await this.dbController.query(
        `INSERT INTO public.feeds (post_id, feed_type, from_sub_feed)
         VALUES ($1, $2, false)
         ON CONFLICT DO NOTHING`,
        [postId, location],
      );

      res.status(201).json({
        list: location,
        post: postId,
      });
    } catch (err: any) {
      error(err.stack || err.message);
      const statusCode = err.message?.includes('connection') ? 500 : 400;
      res.status(statusCode).json({ error: err.message });
      next(err);
    }
  };

  private async feedExists(feedType: string): Promise<boolean> {
    if (!feedType) {
      return false;
    }

    const result = await this.dbController.query<FeedRow>(
      'SELECT name FROM public.feed_list WHERE name = $1 LIMIT 1',
      [feedType],
    );
    return result.rowCount === 1;
  }

  private normalizePostType(rawType: unknown): 'link' | 'text' {
    if (rawType === 'link' || rawType === 'LinkPost') {
      return 'link';
    }
    if (rawType === 'text' || rawType === 'TextPost') {
      return 'text';
    }
    throw new Error(`Unsupported post type: ${String(rawType)}`);
  }

  private sanitizeContent(content: unknown): string {
    return String(content ?? '').replace(/\\/g, '');
  }
}
