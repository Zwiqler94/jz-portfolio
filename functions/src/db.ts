/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable no-extra-boolean-cast */
import { Router, Request, Response, NextFunction } from 'express';
import { Pool, PoolClient, QueryResult } from 'pg';
import { error, debug, info, warn } from 'firebase-functions/logger';

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { PostDBResponse } from './models/post-response.model';
import { postValidator } from './validators/post.validator';
import { validationResult } from 'express-validator';
import { validator } from './middleware';

export const getSecretValue = async (secretName = 'SECRET_NAME') => {
  const client = new SecretsManagerClient({ region: 'us-east-2' });
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  );

  if (response.SecretString) {
    return response.SecretString;
  }

  return '';
};

class AWSDBManager {
  private static username: string;
  private static password: string;
  private pool: Pool | undefined;
  private client: PoolClient | undefined;

  startUpDBService = async () => {
    try {
      debug('constructing');
      if (process.env.DB_ENV && process.env.DB_ENV === 'AWS') {
        this.pool = await this.connectDB(false);
        this.client = await this.pool.connect();
      } else {
        this.pool = await this.connectDB(true);
        this.client = await this.pool.connect();
      }
      debug('done constructing');
      return this.client;
    } catch (err) {
      error(err);
      this.client?.release();
      this.pool?.on('error', (err, client) => {
        error('Unexpected error on idle client', err);
        process.exit(-1);
      });
      throw new Error(JSON.stringify({ connectionError: err }));
    }
  };

  querySingle = async (
    text: string,
    params?: any,
  ): Promise<QueryResult<any>> => {
    try {
      const start = Date.now();
      if (this.client) {
        info('executing query...', { text, params });
        const res = await this.client.query(text, params);
        const duration = Date.now() - start;
        info('query executed', { text, duration, rows: res.rowCount });
        this.client.release();
        return res
          ? res
          : {
              rows: [],
              command: '',
              rowCount: null,
              oid: 0,
              fields: [],
            };
      } else {
        throw new Error('no pool established');
      }
    } catch (err) {
      error(err);
      throw new Error(JSON.stringify(err));
    }
  };

  query = async (text: string, params?: any): Promise<QueryResult<any>> => {
    try {
      const start = Date.now();
      if (this.client) {
        info('executing query...', { text, params });
        const res = await this.client.query(text, params);
        const duration = Date.now() - start;
        info('query executed', { text, duration, rows: res.rowCount });
        return res
          ? res
          : {
              rows: [],
              command: '',
              rowCount: null,
              oid: 0,
              fields: [],
            };
      } else {
        throw new Error('no pool established');
      }
    } catch (err) {
      error(err);
      throw new Error(JSON.stringify(err));
    }
  };

  closeDB = async () => {
    try {
      if (this.pool) await this.pool.end();
      else throw new Error('no pool established');
    } catch (err) {
      error(err);
      throw new Error(JSON.stringify(err));
    }
  };

  connectDB = async (useLocal: boolean) => {
    const application_name = `jlz_portfolio_${process.env.DB_ENV}_${process.env.DB_USER}`;

    if (!useLocal) {
      const { username, password } = JSON.parse(
        await getSecretValue('rds!db-84dfcf5a-5942-4ee0-9122-9ed073a5c0d5'),
      );

      AWSDBManager.password = password;
      AWSDBManager.username = username;

      const caCert = Buffer.from(await getSecretValue('caSSLCert'));

      this.pool = new Pool({
        application_name,
        host: process.env.DB_HOST,
        user: AWSDBManager.username,
        password: AWSDBManager.password,
        database: process.env.DB_NAME,
        ssl: {
          ca: caCert,
        },
      })
        .on('connect', () => {
          debug('connected to prod DB');
        })
        .on('release', () => {
          debug('bye bye');
        });
    } else {
      this.pool = new Pool({
        application_name,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: 5433,
        ssl: false,
      })
        .on('connect', () => {
          debug('connected to local DB');
        })
        .on('release', () => {
          debug('bye bye');
        });
    }
    return this.pool;
  };

  getPuppyPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let mainPosts = new PostDBResponse().createBlankResponse();

      const queryText =
        'select post_list.id, post_list.type from post_list inner join puppy_feed on puppy_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      this.client = await this.startUpDBService();
      if (this.client) {
        mainPosts = await this.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            let result;
            if (row.type === 'text') {
              result = await this.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.query(
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
          this.client.release();
          res.status(200).json(fullPostArray);
        }
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
      next(err);
    }
  };

  getArticlePosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let mainPosts = new PostDBResponse().createBlankResponse();

      const queryText =
        'select post_list.id, post_list.type from post_list inner join articles_feed on articles_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      this.client = await this.startUpDBService();
      if (this.client) {
        mainPosts = await this.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            let result;
            if (row.type === 'text') {
              result = await this.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.query(
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

      const queryText =
        'select post_list.id, post_list.type from post_list inner join apple_feed on apple_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      this.client = await this.startUpDBService();
      if (this.client) {
        mainPosts = await this.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            let result;
            if (row.type === 'text') {
              result = await this.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.query(
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

      const queryText =
        'select post_list.id, post_list.type from post_list inner join blockchain_feed on blockchain_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      this.client = await this.startUpDBService();
      if (this.client) {
        mainPosts = await this.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            info({ row });
            // moose
            let result;
            if (row.type === 'text') {
              info({ ID: row.id });
              result = await this.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.query(
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

      const queryText =
        'select post_list.id, post_list.type from post_list inner join anime_feed on anime_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      // await this.connectDB(useLocalDb);
      this.client = await this.startUpDBService();
      if (this.client) {
        mainPosts = await this.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            let result;
            if (row.type === 'text') {
              result = await this.query(
                'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
                [row.id],
              );
            } else {
              result = await this.query(
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
      this.client = await this.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection failed');
      }

      const queryText = `
      SELECT post_list.id, post_list.type,
             COALESCE(text_post.title, link_post.uri) AS title_or_uri,
             post_list.content, post_list.created_at, post_list.updated_at
      FROM post_list
      INNER JOIN main_feed ON main_feed.post_id = post_list.id
      LEFT JOIN text_post ON post_list.id = text_post.post_list_id
      LEFT JOIN link_post ON post_list.id = link_post.post_list_id;
    `;

      const result = await this.query(queryText);

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

  // getMainPosts = async (req: Request, res: Response, next: NextFunction) => {
  //   // debug({ sesSigned: req.session.cookie.signed });
  //   try {
  //     let mainPosts: QueryResult<any> | undefined =
  //       new PostDBResponse().createBlankResponse();

  //     const queryText =
  //       'select post_list.id, post_list.type from post_list inner join main_feed on main_feed.post_id=post_list.id';

  //     const mainTextPostQuery =
  //       'select * from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ';
  //     const mainLinkPostQuery =
  //       'select * from post_list inner join link_post on post_list.id=link_post.post_list_id where post_list.id=$1 ';

  //     // const useLocalDb = /^true$/i.test(req.query.local!.toString());

  //     // debug(useLocalDb);

  //     // this.pool = await this.connectDB(useLocalDb);
  //     this.client = await this.startUpDBService();
  //     if (this.client) {
  //       mainPosts = await this.query(queryText);

  //       if (mainPosts) {
  //         const fullPostArray: any[] = [];
  //         for (const row of mainPosts.rows) {
  //           debug(row);
  //           let result = undefined;
  //           if (row.type === 'text') {
  //             result = await this.query(mainTextPostQuery, [row.id]);
  //           } else {
  //             result = await this.query(mainLinkPostQuery, [row.id]);
  //           }

  //           const rowResult = result?.rows[0];

  //           warn(rowResult);

  //           if (rowResult) {
  //             fullPostArray.push(rowResult);
  //           } else warn(`Result for Post ID: ${row.id} missing`);
  //         }

  //         console.table(fullPostArray);
  //         res.status(200).json(fullPostArray);
  //       } else {
  //         throw new Error('No Posts');
  //       }
  //     } else {
  //       throw new Error('Pool Client Missing');
  //     }
  //   } catch (err) {
  //     error(err);
  //     res.status(500).json(err);
  //   }
  // };

  /**
   * Creates a new post in the database.
   */
  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type: rawType, location, status, content, title } = req.body;

      // Normalize post type
      const type = ['link', 'LinkPost'].includes(rawType) ? 'link' : 'text';

      this.client = await this.startUpDBService();
      if (!this.client) {
        throw new Error('Database connection not established');
      }

      // Generate hash for the post
      const result = await this.query(
        `SELECT hash_post($1, $2, $3, $4) AS post_hash`,
        [location, type, status, content],
      );
      const postHash = result?.rows[0]?.post_hash;

      if (!postHash) {
        throw new Error('Failed to generate post hash');
      }

      debug({ postHash });

      // Insert post into post_list if it doesn't already exist
      const resultPostList = await this.query(
        `INSERT INTO public.post_list (title, location, status, content, post_hash, type)
       SELECT $1, $2, $3, $4, $5, $6
       WHERE NOT EXISTS (SELECT id FROM public.post_list WHERE post_hash = $5)
       RETURNING id`,
        [title, location, status, content.replace('\\', ''), postHash, type],
      );

      if (!resultPostList || resultPostList.rows.length < 1) {
        throw new Error('Post already exists or failed to insert');
      }

      // Update specific post type table
      await this.query(
        `UPDATE public.${type}_post SET title = $1 WHERE post_hash = $2`,
        [title, postHash],
      );

      debug({ resultPostList: resultPostList.rows });

      res.status(201).json({
        list: location,
        post: resultPostList.rows[0].id,
      });
    } catch (err: any) {
      error(err.stack || err.message);

      // Handle JSON parse errors gracefully
      let errorMessage;
      try {
        errorMessage = JSON.parse((err as Error).message);
      } catch {
        errorMessage = { error: err.message };
      }

      res.status(400).json(errorMessage);
      next(err);
    } finally {
      this.client?.release();
    }
  };

  /**
   * @deprecated
   * @param req
   * @param res
   * @returns
   */
  hashPost = async (req: Request, res: Response, next: NextFunction) => {
    await this.connectDB(true);

    const result = await this.querySingle(
      `select hash_post('${req.body.location}', '${req.body.type}', '${req.body.status}', '${req.body.content}') as post_hash`,
      true,
    );

    return res.status(200).json(result?.rows[0].post_hash);
  };
}

export const postRouter = Router();

// // eslint-disable-next-line @typescript-eslint/no-explicit-any

export const dbManager = new AWSDBManager();

postRouter.get('/main', dbManager.getMainPosts);
postRouter.get('/puppy', dbManager.getPuppyPosts);
postRouter.get('/articles', dbManager.getArticlePosts);
postRouter.get('/apple', dbManager.getApplePosts);
postRouter.get('/blockchain', dbManager.getBlockchainPosts);
postRouter.get('/anime', dbManager.getAnimePosts);
// postRouter.post('/hash', postValidator, dbManager.hashPost);
postRouter.post('/', postValidator, validator, dbManager.createPost);
