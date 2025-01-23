/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable no-extra-boolean-cast */
import { Request, Response, NextFunction } from 'express';
import { PoolClient } from 'pg';
import { error, debug } from 'firebase-functions/logger';
import { DBController } from './db.controller';

export class LinkPreviewController {
  private client: PoolClient | undefined;
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

      // Normalize post type
      // const type = ['link', 'LinkPost'].includes(rawType) ? 'link' : 'text';

      this.client = await this.dbController.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection not established');
      }

      // Generate sanitized content
      // const sanitizedContent = content.replace('\\', '');

      // Generate a unique hash for the post
      // const hashResult = await this.dbController.query(
      //   `SELECT hash_post($1, $2, $3, $4) AS post_hash`,
      //   [location, type, status, sanitizedContent],
      // );

      // const postHash = hashResult?.rows[0]?.post_hash;

      // if (!postHash) {
      //   throw new Error('Failed to generate post hash');
      // }

      // debug({ postHash });

      // Insert post into post_list if it doesn't already exist
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
    } finally {
      try {
        this.client?.release();
      } catch (releaseErr: any) {
        error(`Failed to release database client: ${releaseErr.message}`);
      }
    }
  };

  getLinkPreview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Normalize post type
      // const type = ['link', 'LinkPost'].includes(rawType) ? 'link' : 'text';

      this.client = await this.dbController.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection not established');
      }

      // Generate sanitized content
      // const sanitizedContent = content.replace('\\', '');

      // Generate a unique hash for the post
      // const hashResult = await this.dbController.query(
      //   `SELECT hash_post($1, $2, $3, $4) AS post_hash`,
      //   [location, type, status, sanitizedContent],
      // );

      // const postHash = hashResult?.rows[0]?.post_hash;

      // if (!postHash) {
      //   throw new Error('Failed to generate post hash');
      // }

      // debug({ postHash });

      // Insert post into post_list if it doesn't already exist
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
    } finally {
      try {
        this.client?.release();
      } catch (releaseErr: any) {
        error(`Failed to release database client: ${releaseErr.message}`);
      }
    }
  };
}
