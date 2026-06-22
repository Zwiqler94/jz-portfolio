import { Request, Response, NextFunction } from 'express';
import { error, debug } from 'firebase-functions/logger';
import { DBController } from './db.controller';

export class LinkPreviewController {
  private dbController: DBController;

  constructor(dbController: DBController) {
    this.dbController = dbController;
  }

  storeLinkPreview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id, data } = req.body;
      const { title, image } = data;

      const insertResult = await this.dbController.query(
        `UPDATE public.link_post
        SET title = $2, image_uri = $3
       WHERE post_list_id = $1
       RETURNING id`,
        [id, title, image],
      );

      const postId = insertResult?.rows[0]?.id;
      if (!postId) {
        res.status(409).json({ error: ' failed to update' });
        return;
      }

      debug({ resultPostList: insertResult.rows });

      res.status(201).json({
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
    }
  };

  getLinkPreview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const insertResult = await this.dbController.query(
        `SELECT title, uri FROM public.link_post WHERE post_list_id = $1`,
        [id],
      );

      debug({ resultPostList: insertResult.rows });

      res.status(200).send(insertResult.rows[0]);
    } catch (err: any) {
      error(err.stack || err.message);

      // Return a structured error response
      const statusCode = err.message.includes('connection')
        ? 500 // Server error for DB connection issues
        : 400; // Bad request for other errors

      res.status(statusCode).json({ error: err.message });
      next(err); // Pass error to global error handler if needed
    }
  };
}
