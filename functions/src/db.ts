/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable no-extra-boolean-cast */
import { Router, Request, Response } from 'express';
import { Pool, PoolClient, QueryResult } from 'pg';
import { error, debug, info, warn } from 'firebase-functions/logger';

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { PostDBResponse } from './models/post-response.model';
import { postValidator } from './validators/post.validator';

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

  getPuppyPosts = async (req: Request, res: Response) => {
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
    }
  };

  getArticlePosts = async (req: Request, res: Response) => {
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
    }
  };

  getApplePosts = async (req: Request, res: Response) => {
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
    }
  };

  getBlockchainPosts = async (req: Request, res: Response) => {
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
    }
  };

  getAnimePosts = async (req: Request, res: Response) => {
    try {
      if (req.cookies.jlz_portfolio_local_jake) {
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
      } else {
        console.log(req.cookies);
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
    }
  };

  getMainPosts = async (req: Request, res: Response) => {
    debug({ sesSigned: req.session.cookie.signed });
    try {
      let mainPosts: QueryResult<any> | undefined =
        new PostDBResponse().createBlankResponse();

      const queryText =
        'select post_list.id, post_list.type from post_list inner join main_feed on main_feed.post_id=post_list.id';

      const mainTextPostQuery =
        'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ';
      const mainLinkPostQuery =
        'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.post_list_id where post_list.id=$1 ';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      debug(useLocalDb);

      // this.pool = await this.connectDB(useLocalDb);
      this.client = await this.startUpDBService();
      if (this.client) {
        mainPosts = await this.query(queryText);

        if (mainPosts) {
          const fullPostArray: any[] = [];
          for (const row of mainPosts.rows) {
            debug(row);
            let result = undefined;
            if (row.type === 'text') {
              result = await this.query(mainTextPostQuery, [row.id]);
            } else {
              result = await this.query(mainLinkPostQuery, [row.id]);
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
        throw new Error('Pool Client Missing');
      }
    } catch (err) {
      error(err);
      res.status(500).json(err);
    }
  };

  /**
   * @todo
   * @param req
   * @param res
   * @returns
   */
  createPost = async (req: Request, res: Response) => {
    try {
      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      debug(useLocalDb);

      this.client = await this.startUpDBService();
      if (this.client) {
        try {
          const result = await this.query(
            `select hash_post($1, $2, $3, $4) as post_hash`,
            [
              req.body.location,
              req.body.type,
              req.body.status,
              req.body.content,
            ],
          );

          const post_hash_result: string = result?.rows[0].post_hash;

          debug({ post_hash_result });

          if (post_hash_result.length > 0) {
            try {
              const resultPostList = await this.query(
                `insert into public.post_list(title, location, status, content, post_hash, type) select $1, $2, $3, $4, $5, $6 where not exists (select id from public.post_list where post_hash=$4) returning id`,
                [
                  req.body.title,
                  req.body.location,
                  req.body.status,
                  req.body.content.replace('\\', ''),
                  post_hash_result,
                  req.body.type,
                ],
              );

              if (resultPostList) {
                if (resultPostList.rows.length < 1)
                  return res.status(400).json({ error: 'Post Already Exists' });

                try {
                  await this.query(
                    `update public.${req.body.type}_post set title=$1 where post_hash=$2;`,
                    [req.body.title, post_hash_result],
                  );

                  console.table(resultPostList);

                  return res.status(201).json({
                    list: req.body.location,
                    post: resultPostList.rows[0].id,
                  });
                } catch (err) {
                  error(err);
                  return res.status(400).json({ err });
                }
              } else {
                throw new Error('Post Not Created');
              }
            } catch (err) {
              error(err);
              return res.status(400).json(err);
            }
          } else {
            throw new Error('Post Hash Missing');
          }
        } catch (err) {
          error(err);
          return res.status(400).json({ err });
        } finally {
          this.client.release();
        }
      } else {
        throw new Error('Pool Client Missing');
      }
    } catch (err: any) {
      error(err);
      return res.status(400).json({ err });
    }
  };

  /**
   * @deprecated
   * @param req
   * @param res
   * @returns
   */
  hashPost = async (req: Request, res: Response) => {
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

const dbManager = new AWSDBManager();

postRouter.get('/main', dbManager.getMainPosts);
postRouter.get('/puppy', dbManager.getPuppyPosts);
postRouter.get('/articles', dbManager.getArticlePosts);
postRouter.get('/apple', dbManager.getApplePosts);
postRouter.get('/blockchain', dbManager.getBlockchainPosts);
postRouter.get('/anime', dbManager.getAnimePosts);
// postRouter.post('/hash', postValidator, dbManager.hashPost);
postRouter.post('/', postValidator, dbManager.createPost);
