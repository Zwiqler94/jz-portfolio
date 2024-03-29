/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable no-extra-boolean-cast */
import { Router, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import { error, debug, info, warn } from 'firebase-functions/logger';

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { postValidator } from './validators/post.validator';
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
  private pool: Pool = new Pool();

  constructor() {
    if (process.env.DB_ENV && process.env.DB_ENV === 'AWS')
      (async () => await this.connectDB(false))();
    else (async () => await this.connectDB(true))();
  }

  private async query(text: string, params?: any): Promise<QueryResult<any>> {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    info('executed query', { text, duration, rows: res.rowCount });
    return res
      ? res
      : {
          rows: [],
          command: '',
          rowCount: null,
          oid: 0,
          fields: [],
        };
  }

  async closeDB() {
    await this.pool.end();
  }

  async connectDB(useLocal: boolean) {
    if (!useLocal) {
      const { username, password } = JSON.parse(
        await getSecretValue('rds!db-84dfcf5a-5942-4ee0-9122-9ed073a5c0d5'),
      );

      AWSDBManager.password = password;
      AWSDBManager.username = username;

      const caCert = Buffer.from(await getSecretValue('caSSLCert'));

      this.pool = new Pool({
        host: 'jz-portfolio.cj0jeurehhtj.us-east-2.rds.amazonaws.com',
        user: AWSDBManager.username,
        password: AWSDBManager.password,
        database: 'jz_dev',
        ssl: {
          ca: caCert,
        },
      }).on('connect', () => {
        debug('connected to prod DB');
      });
    } else {
      this.pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'jz-local',
        port: 5433,
        ssl: false,
      }).on('connect', () => {
        debug('connected to local DB');
      });
    }
  }

  getPuppyPosts = async (req: Request, res: Response) => {
    try {
      let mainPosts: QueryResult<any> = {
        rows: [],
        command: '',
        rowCount: null,
        oid: 0,
        fields: [],
      };

      const queryText =
        'select post_list.id, post_list.type from post_list inner join puppy_feed on puppy_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      await this.connectDB(useLocalDb);
      mainPosts = await this.pool.query(queryText);

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await this.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await this.pool.query(
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
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };

  getArticlePosts = async (req: Request, res: Response) => {
    try {
      let mainPosts: QueryResult<any> = {
        rows: [],
        command: '',
        rowCount: null,
        oid: 0,
        fields: [],
      };

      const queryText =
        'select post_list.id, post_list.type from post_list inner join articles_feed on articles_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      await this.connectDB(useLocalDb);
      mainPosts = await this.pool.query(queryText);

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await this.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await this.pool.query(
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
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };

  getApplePosts = async (req: Request, res: Response) => {
    try {
      let mainPosts: QueryResult<any> = {
        rows: [],
        command: '',
        rowCount: null,
        oid: 0,
        fields: [],
      };

      const queryText =
        'select post_list.id, post_list.type from post_list inner join apple_feed on apple_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      await this.connectDB(useLocalDb);
      mainPosts = await this.pool.query(queryText);

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await this.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await this.pool.query(
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
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };

  getBlockchainPosts = async (req: Request, res: Response) => {
    try {
      let mainPosts: QueryResult<any> = {
        rows: [],
        command: '',
        rowCount: null,
        oid: 0,
        fields: [],
      };

      const queryText =
        'select post_list.id, post_list.type from post_list inner join blockchain_feed on blockchain_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      await this.connectDB(useLocalDb);
      mainPosts = await this.pool.query(queryText);

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          console.log({ row });
          // moose
          let result;
          if (row.type === 'text') {
            console.log({ ID: row.id });
            result = await this.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await this.pool.query(
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
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };

  getAnimePosts = async (req: Request, res: Response) => {
    try {
      let mainPosts: QueryResult<any> = {
        rows: [],
        command: '',
        rowCount: null,
        oid: 0,
        fields: [],
      };

      const queryText =
        'select post_list.id, post_list.type from post_list inner join anime_feed on anime_feed.post_id=post_list.id';

      const useLocalDb = /^true$/i.test(
        req.query.local ? req.query.local.toString() : 'true',
      );

      await this.connectDB(useLocalDb);
      mainPosts = await this.pool.query(queryText);

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await this.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.post_list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await this.pool.query(
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
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };

  getMainPosts = async (req: Request, res: Response) => {
    try {
      let mainPosts: QueryResult<any> | undefined = {
        rows: [],
        command: '',
        rowCount: null,
        oid: 0,
        fields: [],
      };

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
      // }
      // else {
      //   this.connectLocalDB();
      //   AWSDBManager.connectLocalDB();
      //   mainPosts = await this.query(queryText);
      //   if (mainPosts) {
      //     const fullPostArray: any[] = [];
      //     for (const row of mainPosts.rows) {
      //       let result;
      //       if (row.type === 'text') {
      //         result = await this.queryLocal(mainTextPostQuery, [row.id]);
      //       } else {
      //         result = await this.queryLocal(mainLinkPostQuery, [row.id]);
      //       }
      //       fullPostArray.push(result.rows[0]);
      //     }

      //     console.table(fullPostArray);
      //     res.status(200).json(fullPostArray);
      //   }
      // }
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
  // createPost = async (req: Request, res: Response) => {
  //   try {
  //     await this.connectDB(true);

  //     debug({ test: req.body.content });

  //     const resultPostList = await this.query(
  //       `insert into public.post_list(location, status, content, post_hash) select '${
  //         req.body.location
  //       }', '${req.body.status}', '${req.body.content.replace(
  //         '\\',
  //         '',
  //       )}', '${post_hash_result}' where not exists (select id from public.post_list where post_hash = '${post_hash_result}') returning id`,
  //       true,
  //     );

  //     if (resultPostList) {
  //       if (resultPostList.rows.length < 1)
  //         return res.status(400).json({ error: 'Post Already Exists' });

  //       // const locationId = await this.query(
  //       //   ` select feed_name_to_id('${req.body.location}') as feed_id`,
  //       //   true
  //       // );

  //       await this.query(
  //         `update public.text_post set title = '${req.body.title}' where post_hash = '${post_hash_result}';`,
  //         true,
  //       );
  //       // const resultFeed = await this.query(
  //       //   `insert into public.main_feed(list_id, post_id, from_sub_feed, post_hash) values ('${
  //       //     locationId.rows[0].feed_id
  //       //   }', '${
  //       //     resultPostList.rows[0].id
  //       //   }', '${false}', '${post_hash_result}') returning list_id, post_id`,
  //       //   true
  //       // );

  //       return res.status(201).json({
  //         list: req.body.location,
  //         post: resultPostList.rows[0].id,
  //       });
  //     } else {
  //       throw new Error('Results Missing');
  //     }
  //   } catch (err) {
  //     error(err);
  //     return res.status(400).json({ err });
  //   }
  // };

  /**
   * @deprecated
   * @param req
   * @param res
   * @returns
   */
  hashPost = async (req: Request, res: Response) => {
    await this.connectDB(true);

    const result = await this.query(
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
// postRouter.post('/hash', postValidator, validator, dbManager.hashPost);
// postRouter.post('/', postValidator, validator, dbManager.createPost);
