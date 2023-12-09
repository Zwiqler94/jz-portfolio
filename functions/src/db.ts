/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
import { Router, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import { error, debug, info } from 'firebase-functions/logger';

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
    })
  );

  if (response.SecretString) {
    return response.SecretString;
  }

  return '';
};

class AWSDBManager {
  private static username: string;
  private static password: string;
  private static pool: Pool;
  private static poolLocal: Pool;

  static async closeDB() {
    await this.pool.end();
  }

  static async connectDB() {
    const { username, password } = JSON.parse(
      await getSecretValue('rds!db-84dfcf5a-5942-4ee0-9122-9ed073a5c0d5')
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
  }

  static async connectLocalDB() {
    this.poolLocal = new Pool({
      host: '127.0.0.1',
      user: 'jake',
      port: 5433,
      password: '7--h7wBV-rWrk*JZhGe-',
      database: 'jz-local',
      ssl: false,
    }).on('connect', () => {
      debug('connected to local DB');
    });
  }

  async getPuppyPosts(req: Request, res: Response) {
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

      if (!Boolean(req.params.local)) {
        await AWSDBManager.connectDB();
        mainPosts = await AWSDBManager.pool.query(queryText);
      } else {
        AWSDBManager.connectLocalDB();
        mainPosts = await AWSDBManager.poolLocal.query(queryText);
      }

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          }
          fullPostArray.push(result.rows[0]);
        }

        console.table(fullPostArray);

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  async getArticlePosts(req: Request, res: Response) {
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

      if (!Boolean(req.params.local)) {
        await AWSDBManager.connectDB();
        mainPosts = await AWSDBManager.pool.query(queryText);
      } else {
        AWSDBManager.connectLocalDB();
        mainPosts = await AWSDBManager.poolLocal.query(queryText);
      }

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          }
          fullPostArray.push(result.rows[0]);
        }

        console.table(fullPostArray);

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  async getApplePosts(req: Request, res: Response) {
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

      if (!Boolean(req.params.local)) {
        await AWSDBManager.connectDB();
        mainPosts = await AWSDBManager.pool.query(queryText);
      } else {
        AWSDBManager.connectLocalDB();
        mainPosts = await AWSDBManager.poolLocal.query(queryText);
      }

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          }
          fullPostArray.push(result.rows[0]);
        }

        console.table(fullPostArray);

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  async getBlockchainPosts(req: Request, res: Response) {
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

      if (!Boolean(req.params.local)) {
        await AWSDBManager.connectDB();
        mainPosts = await AWSDBManager.pool.query(queryText);
      } else {
        AWSDBManager.connectLocalDB();
        mainPosts = await AWSDBManager.poolLocal.query(queryText);
      }

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          }
          fullPostArray.push(result.rows[0]);
        }

        console.table(fullPostArray);

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  async getAnimePosts(req: Request, res: Response) {
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

      if (!Boolean(req.params.local)) {
        await AWSDBManager.connectDB();
        mainPosts = await AWSDBManager.pool.query(queryText);
      } else {
        AWSDBManager.connectLocalDB();
        mainPosts = await AWSDBManager.poolLocal.query(queryText);
      }

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id]
            );
          }
          fullPostArray.push(result.rows[0]);
        }

        console.table(fullPostArray);

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  async getMainPosts(req: Request, res: Response) {
    try {
      let mainPosts: QueryResult<any> = {
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
        'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ';

      const useLocal = Boolean(req.query.local);
      debug(useLocal, Boolean(req.query.local), req.query.local);
      useLocal
        ? await AWSDBManager.connectLocalDB()
        : await AWSDBManager.connectDB();
      mainPosts = await AWSDBManager.query(queryText, useLocal);
      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.query(mainTextPostQuery, useLocal, [
              row.id,
            ]);
          } else {
            result = await AWSDBManager.query(mainLinkPostQuery, useLocal, [
              row.id,
            ]);
          }
          fullPostArray.push(result.rows[0]);
        }



        console.table(fullPostArray);
        res.status(200).json(fullPostArray);
      }
      // }
      // else {
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
  }

  async createPost(req: Request, res: Response) {
   try{ await AWSDBManager.connectLocalDB();

    debug({test:req.body.content});

    const post_hash_result = (
      await AWSDBManager.query(
        `select hash_post('${req.body.location}', '${req.body.type}', '${
          req.body.status
        }', '${req.body.content.replace('\\', '')}') as post_hash`,
        true
      )
    ).rows[0].post_hash;

    const resultPostList = await AWSDBManager.query(
      `insert into public.post_list(location, status, content, post_hash) select '${req.body.location}', '${req.body.status}', '${req.body.content.replace("\\","")}', '${post_hash_result}' where not exists (select id from public.post_list where post_hash = '${post_hash_result}') returning id`,
      true
    );

    if (resultPostList.rows.length < 1)
      return res.status(400).json({ error: 'Post Already Exists' });

    // const locationId = await AWSDBManager.query(
    //   ` select feed_name_to_id('${req.body.location}') as feed_id`,
    //   true
    // );

    await AWSDBManager.query(
      `update public.text_post set title = '${req.body.title}' where post_hash = '${post_hash_result}';`,
      true
    );
    // const resultFeed = await AWSDBManager.query(
    //   `insert into public.main_feed(list_id, post_id, from_sub_feed, post_hash) values ('${
    //     locationId.rows[0].feed_id
    //   }', '${
    //     resultPostList.rows[0].id
    //   }', '${false}', '${post_hash_result}') returning list_id, post_id`,
    //   true
    // );

    return res.status(201).json({
      list: req.body.location,
      post: resultPostList.rows[0].id,
    });
   } catch (err) {
     error(err)
     return res.status(400).json({err});
    }
  }

  static async query(text: string, useLocal: boolean, params?: any) {
    const start = Date.now();
    const res = useLocal
      ? await AWSDBManager.poolLocal.query(text, params)
      : await AWSDBManager.pool.query(text, params);
    const duration = Date.now() - start;
    info('executed query', { text, duration, rows: res.rowCount });
    return res;
  }

  async hashPost(req: Request, res: Response) {
    await AWSDBManager.connectLocalDB();

    const result = AWSDBManager.query(
      `select hash_post('${req.body.location}', '${req.body.type}', '${req.body.status}', '${req.body.content}') as post_hash`,
      true
    );
    return res.status(200).json((await result).rows[0].post_hash);
  }
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
postRouter.post('/hash', postValidator, validator, dbManager.hashPost);
postRouter.post('/', postValidator, validator, dbManager.createPost);
