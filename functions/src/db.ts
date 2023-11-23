/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
// import { info } from 'firebase-functions/logger';
// import { debug } from 'console';

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

export const getSecretValue = async (secretName = 'SECRET_NAME') => {
  const client = new SecretsManagerClient({ region: 'us-east-2' });
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  );
  // console.log(response);
  // {
  //   '$metadata': {
  //     httpStatusCode: 200,
  //     requestId: '584eb612-f8b0-48c9-855e-6d246461b604',
  //     extendedRequestId: undefined,
  //     cfId: undefined,
  //     attempts: 1,
  //     totalRetryDelay: 0
  //   },
  //   ARN: 'arn:aws:secretsmanager:us-east-1:xxxxxxxxxxxx:secret:binary-secret-3873048-xxxxxx',
  //   CreatedDate: 2023-08-08T19:29:51.294Z,
  //   Name: 'binary-secret-3873048',
  //   SecretBinary: Uint8Array(11) [
  //      98, 105, 110, 97, 114,
  //     121,  32, 100, 97, 116,
  //      97
  //   ],
  //   VersionId: '712083f4-0d26-415e-8044-16735142cd6a',
  //   VersionStages: [ 'AWSCURRENT' ]
  // }

  if (response.SecretString) {
    return response.SecretString;
  }

  // if (response.SecretBinary) {
  //   return response.SecretBinary;
  // }

  return '';
};

class AWSDBManager {
  private static username: string;
  private static password: string;
  private static pool: Pool;

  static async closeDB() {
    await this.pool.end();
  }

  static async connectDB() {
    const { username, password } = JSON.parse(
      await getSecretValue('rds!db-84dfcf5a-5942-4ee0-9122-9ed073a5c0d5'),
    );

    AWSDBManager.password = password;
    AWSDBManager.username = username;

    const caCert = Buffer.from(await getSecretValue('caSSLCert'));

    // if (!this.pool) {
    this.pool = new Pool({
      host: 'jz-portfolio.cj0jeurehhtj.us-east-2.rds.amazonaws.com',
      user: AWSDBManager.username,
      password: AWSDBManager.password,
      database: 'jz_dev',
      ssl: {
        ca: caCert,
      },
    });
    // }
  }

  async getPuppyPosts(req: Request, res: Response) {
    try {
      await AWSDBManager.connectDB();
      const mainPosts = await AWSDBManager.pool.query(
        'select post_list.id, post_list.type from post_list inner join puppy_feed on puppy_feed.post_id=post_list.id',
      );

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          }
          fullPostArray.push(result.rows[0]);
        }
        // mainPosts.rows.forEach((row) => {
        //   const result = query('select * from post_list where id=$1', [row.post_id]);
        //   fullPostArray.push(result);
        // })
        console.table(fullPostArray);
        // await AWSDBManager.pool.end();

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  async getArticlePosts(req: Request, res: Response) {
    try {
      await AWSDBManager.connectDB();
      const mainPosts = await AWSDBManager.pool.query(
        'select post_list.id, post_list.type from post_list inner join articles_feed on articles_feed.post_id=post_list.id',
      );

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          }
          fullPostArray.push(result.rows[0]);
        }
        // mainPosts.rows.forEach((row) => {
        //   const result = query('select * from post_list where id=$1', [row.post_id]);
        //   fullPostArray.push(result);
        // })
        console.table(fullPostArray);
        // await AWSDBManager.pool.end();

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
  async getApplePosts(req: Request, res: Response) {
    try {
      await AWSDBManager.connectDB();
      const mainPosts = await AWSDBManager.pool.query(
        'select post_list.id, post_list.type from post_list inner join apple_feed on apple_feed.post_id=post_list.id',
      );

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          }
          fullPostArray.push(result.rows[0]);
        }
        // mainPosts.rows.forEach((row) => {
        //   const result = query('select * from post_list where id=$1', [row.post_id]);
        //   fullPostArray.push(result);
        // })
        console.table(fullPostArray);
        // await AWSDBManager.pool.end();

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  async getBlockchainPosts(req: Request, res: Response) {
    try {
      await AWSDBManager.connectDB();
      const mainPosts = await AWSDBManager.pool.query(
        'select post_list.id, post_list.type from post_list inner join blockchain_feed on blockchain_feed.post_id=post_list.id',
      );

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          }
          fullPostArray.push(result.rows[0]);
        }
        // mainPosts.rows.forEach((row) => {
        //   const result = query('select * from post_list where id=$1', [row.post_id]);
        //   fullPostArray.push(result);
        // })
        console.table(fullPostArray);
        // await AWSDBManager.pool.end();

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  async getAnimePosts(req: Request, res: Response) {
    try {
      await AWSDBManager.connectDB();
      const mainPosts = await AWSDBManager.pool.query(
        'select post_list.id, post_list.type from post_list inner join anime_feed on anime_feed.post_id=post_list.id',
      );

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          }
          fullPostArray.push(result.rows[0]);
        }
        // mainPosts.rows.forEach((row) => {
        //   const result = query('select * from post_list where id=$1', [row.post_id]);
        //   fullPostArray.push(result);
        // })
        console.table(fullPostArray);
        // await AWSDBManager.pool.end();

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

  async getMainPosts(req: Request, res: Response) {
    try {
      await AWSDBManager.connectDB();
      const mainPosts = await AWSDBManager.pool.query(
        'select post_list.id, post_list.type from post_list inner join main_feed on main_feed.post_id=post_list.id',
      );

      if (mainPosts) {
        const fullPostArray: any[] = [];
        for (const row of mainPosts.rows) {
          let result;
          if (row.type === 'text') {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          } else {
            result = await AWSDBManager.pool.query(
              'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
              [row.id],
            );
          }
          fullPostArray.push(result.rows[0]);
        }
        // mainPosts.rows.forEach((row) => {
        //   const result = query('select * from post_list where id=$1', [row.post_id]);
        //   fullPostArray.push(result);
        // })
        console.table(fullPostArray);
        // await AWSDBManager.pool.end();

        res.status(200).json(fullPostArray);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
}

export const postRouter = Router();

// // eslint-disable-next-line @typescript-eslint/no-explicit-any

const dbManager = new AWSDBManager();

// async function db() {
//   return 'meep';
// }

// await db();

postRouter.get('/main', dbManager.getMainPosts);
postRouter.get('/puppy', dbManager.getPuppyPosts);
postRouter.get('/articles', dbManager.getArticlePosts);
postRouter.get('/apple', dbManager.getApplePosts);
postRouter.get('/blockchain', dbManager.getBlockchainPosts);
postRouter.get('/anime', dbManager.getAnimePosts);
