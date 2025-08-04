import { Request, Response, NextFunction } from 'express';
import { PoolClient } from 'pg';
import { error, debug, info, warn } from 'firebase-functions/logger';
import { PostDBResponse } from '../models/post-response.model';
import { DBController } from './db.controller';

export class PostController {
  private client: PoolClient | undefined;
  private dbController: DBController;

  constructor(dbController: DBController) {
    this.dbController = dbController;
  }

  getPuppyPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const queryText = `
  SELECT post_list.id, post_list.type
  FROM post_list
  INNER JOIN feeds ON feeds.post_id = post_list.id
  WHERE feeds.feed_type = 'puppy'`;

      this.client = await this.dbController.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection not established');
      }

      const mainPosts = await this.dbController.query(queryText);
      if (!mainPosts?.rows || mainPosts.rows.length === 0) {
        res.status(404).json({ message: 'No posts found' });
        return;
      }

      const fullPostArray: any[] = [];
      for (const row of mainPosts.rows) {
        const postDetails = await this.fetchPostDetails(row);
        if (postDetails) {
          fullPostArray.push(postDetails);
        } else {
          warn(`Result for Post ID: ${row.id} missing`);
        }
      }

      res.status(200).json(fullPostArray);
    } catch (err: any) {
      error(err);
      next(err); // Pass error to the error-handling middleware
    } finally {
      this.client?.release();
    }
  };

  getArticlePosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let mainPosts = new PostDBResponse().createBlankResponse();

      const queryText = `
  SELECT post_list.id, post_list.type
  FROM post_list
  INNER JOIN feeds ON feeds.post_id = post_list.id
  WHERE feeds.feed_type = 'article'`;

      this.client = await this.dbController.startUpDBService();
      if (this.client) {
        mainPosts = await this.dbController.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            let result;
            if (row.type === 'text') {
              result = await this.dbController.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.dbController.query(
                'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            }
            const rowResult = result?.rows[0];

            warn(rowResult);

            if (rowResult) {
              fullPostArray.push(rowResult);
            } else warn(`Result for Post ID: ${row.id} missing`);
          }

          console.table(fullPostArray);

          res.status(200).json(fullPostArray);
        }
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
      next(err);
    }
  };

  getApplePosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let mainPosts = new PostDBResponse().createBlankResponse();

      const queryText = `
  SELECT post_list.id, post_list.type
  FROM post_list
  INNER JOIN feeds ON feeds.post_id = post_list.id
  WHERE feeds.feed_type = 'apple'`;

      this.client = await this.dbController.startUpDBService();
      if (this.client) {
        mainPosts = await this.dbController.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            let result;
            if (row.type === 'text') {
              result = await this.dbController.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.dbController.query(
                'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            }
            const rowResult = result?.rows[0];

            warn(rowResult);

            if (rowResult) {
              fullPostArray.push(rowResult);
            } else warn(`Result for Post ID: ${row.id} missing`);
          }

          console.table(fullPostArray);

          res.status(200).json(fullPostArray);
        }
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
      next(err);
    }
  };

  getBlockchainPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      let mainPosts = new PostDBResponse().createBlankResponse();

      const queryText = `
  SELECT post_list.id, post_list.type
  FROM post_list
  INNER JOIN feeds ON feeds.post_id = post_list.id
  WHERE feeds.feed_type = 'blockchain'`;

      this.client = await this.dbController.startUpDBService();
      if (this.client) {
        mainPosts = await this.dbController.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            info({ row });
            // moose
            let result;
            if (row.type === 'text') {
              info({ ID: row.id });
              result = await this.dbController.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.dbController.query(
                'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            }
            const rowResult = result?.rows[0];

            warn(rowResult);

            if (rowResult) {
              fullPostArray.push(rowResult);
            } else warn(`Result for Post ID: ${row.id} missing`);
          }

          console.table(fullPostArray);

          res.status(200).json(fullPostArray);
        }
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
      next(err);
    }
  };

  getAnimePosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let mainPosts = new PostDBResponse().createBlankResponse();

      const queryText = `
  SELECT post_list.id, post_list.type
  FROM post_list
  INNER JOIN feeds ON feeds.post_id = post_list.id
  WHERE feeds.feed_type = 'anime'`;

      // await this.dbController.connectDB(useLocalDb);
      this.client = await this.dbController.startUpDBService();
      if (this.client) {
        mainPosts = await this.dbController.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            let result;
            if (row.type === 'text') {
              result = await this.dbController.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.dbController.query(
                'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            }
            const rowResult = result?.rows[0];

            warn(rowResult);

            if (rowResult) {
              fullPostArray.push(rowResult);
            } else warn(`Result for Post ID: ${row.id} missing`);
          }

          console.table(fullPostArray);

          res.status(200).json(fullPostArray);
        }
      } else {
        throw new Error('no pool established');
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
      next(err);
    }
  };

  getMainPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.client = await this.dbController.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection failed');
      }

      const queryText = `
        SELECT post_list.id, post_list.type,
              COALESCE(text_post.title, link_post.uri) AS title_or_uri,
              post_list.content, post_list.created_at, post_list.updated_at
        FROM post_list
        INNER JOIN feeds ON feeds.post_id = post_list.id
        LEFT JOIN text_post ON post_list.id = text_post.post_list_id
        LEFT JOIN link_post ON post_list.id = link_post.post_list_id
        WHERE feeds.feed_type = 'main';
      `;

      const result = await this.dbController.query(queryText);

      if (result?.rows) {
        res.status(200).json(result.rows);
      } else {
        res.status(404).json({ message: 'No posts found' });
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
      next(err);
    } finally {
      this.client?.release();
    }
  };

  getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { feedType } = req.params; // Expect feedType from the route parameter
      const validFeeds = [
        'anime',
        'articles',
        'apple',
        'blockchain',
        'puppy',
        'main',
      ];

      if (!validFeeds.includes(feedType)) {
        res.status(400).json({ error: `Invalid feed type: ${feedType}` });
        return;
      }

      this.client = await this.dbController.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection not established');
      }

      // Fetch posts for the given feed type
      const mainPosts = await this.fetchPostsByFeed(feedType);
      if (mainPosts.length === 0) {
        res.status(404).json({ message: 'No posts found' });
      }

      // Fetch detailed data for each post
      const fullPostArray = [];
      for (const row of mainPosts) {
        const postDetails = await this.fetchPostDetails(row);
        if (postDetails) {
          fullPostArray.push(postDetails);
        } else {
          warn(`Result for Post ID: ${row.id} missing`);
        }
      }

      res.status(200).json(fullPostArray);
    } catch (err: any) {
      error(err);
      res.status(500).json({ error: err.message });
      next(err);
    } finally {
      this.client?.release();
    }
  };

  /**
   * Creates a new post in the database.
   */
  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type: rawType, location, status, content, title } = req.body; // Location is feedType

      // Normalize post type
      const type = ['link', 'LinkPost'].includes(rawType) ? 'link' : 'text';

      this.client = await this.dbController.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection not established');
      }

      // Sanitize content to prevent escaping issues
      const sanitizedContent = content.replace('\\', '');

      // Generate a unique hash for the post
      const hashResult = await this.dbController.query(
        `SELECT hash_post($1, $2, $3, $4) AS post_hash`,
        [location, type, status, sanitizedContent],
      );

      const postHash = hashResult?.rows[0]?.post_hash;
      if (!postHash) {
        throw new Error('Failed to generate post hash');
      }

      debug({ postHash });

      // Insert post into post_list if it doesn't already exist
      const insertResult = await this.dbController.query(
        `INSERT INTO public.post_list (title, location, status, content, post_hash, type)
       SELECT $1, $2, $3, $4, $5, $6
       WHERE NOT EXISTS (SELECT id FROM public.post_list WHERE post_hash = $5)
       RETURNING id`,
        [title, location, status, sanitizedContent, postHash, type],
      );

      const postId = insertResult?.rows[0]?.id;
      if (!postId) {
        res
          .status(409)
          .json({ error: 'Post already exists or failed to insert' });
        return;
      }

      // Ensure location (feedType) is valid before inserting
      const validFeeds = [
        'anime',
        'articles',
        'apple',
        'blockchain',
        'puppy',
        'main',
      ];
      if (!validFeeds.includes(location)) {
        throw new Error(`Invalid feed type: ${location}`);
      }

      // Insert post into the unified feeds table
      await this.dbController.query(
        `INSERT INTO public.feeds (post_id, feed_type) VALUES ($1, $2)`,
        [postId, location], // Location is now feedType
      );

      debug({ resultPostList: insertResult.rows });

      res.status(201).json({
        list: location, // Returns the feed type
        post: postId,
      });
    } catch (err: any) {
      error(err.stack || err.message);

      // Return a structured error response
      const statusCode = err.message.includes('connection')
        ? 500 // Server error for DB connection issues
        : 400; // Bad request for other errors

      res.status(statusCode).json({ error: err.message });
      next(err); // Pass error to global error handler if needed
    } finally {
      try {
        this.client?.release();
      } catch (releaseErr: any) {
        error(`Failed to release database client: ${releaseErr.message}`);
      }
    }
  };

  /**
   * @deprecated
   * @param req
   * @param res
   * @returns
   */
  hashPost = async (req: Request, res: Response) => {
    await this.dbController.connectDB(true);

    const result = await this.dbController.querySingle(
      `select hash_post('${req.body.location}', '${req.body.type}', '${req.body.status}', '${req.body.content}') as post_hash`,
      true,
    );

    return res.status(200).json(result?.rows[0].post_hash);
  };

  private async fetchPostDetails(row: any) {
    const query =
      row.type === 'text'
        ? `SELECT post_list.id, post_list.type, text_post.title, post_list.content, post_list.created_at, post_list.updated_at
         FROM post_list
         INNER JOIN text_post ON post_list.id = text_post.post_list_id
         WHERE post_list.id = $1`
        : `SELECT post_list.id, post_list.type, link_post.uri, link_post.image_uri ,post_list.content, post_list.created_at, post_list.updated_at
         FROM post_list
         INNER JOIN link_post ON post_list.id = link_post.post_list_id
         WHERE post_list.id = $1`;
    const result = await this.dbController.query(query, [row.id]);
    return result?.rows[0];
  }

  private async fetchPostsByFeed(feedType: string): Promise<any[]> {
    const validFeeds = ['puppy', 'anime', 'apple', 'blockchain', 'main'];

    if (!validFeeds.includes(feedType)) {
      throw new Error(`Invalid feed type: ${feedType}`);
    }

    const queryText = `
  SELECT post_list.id, post_list.type
  FROM post_list
  INNER JOIN feeds ON feeds.post_id = post_list.id
  WHERE feeds.feed_type = $1
`;
    const mainPosts = await this.dbController.query(queryText, [feedType]);

    return mainPosts?.rows || [];
  }
}
