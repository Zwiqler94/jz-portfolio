/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { info } from 'firebase-functions/logger';
import { debug } from 'console';

// export class DBManager {
//   pool: Pool | undefined;
//   connectorInstance = new Connector();
//   clientOpts: any;
//   setUpPool =  () => {
//    return  this.connectorInstance.getOptions({
//       authType: AuthTypes.PASSWORD,
//       instanceConnectionName: 'jlz-portfolio:us-central1:jz-dev',
//       ipType: IpAddressTypes.PUBLIC,
//     });

//   };
//   // sslConectionOptions: ConnectionOptions = {
//   //   rejectUnauthorized: false,
//   //   ca: process.env.JLZ_APP_SERVER_CA,
//   //   key: process.env.JLZ_APP_CLIENT_KEY,
//   //   cert: process.env.JLZ_APP_CLIENT_CERT,
//   // };

//   // host: (process.env.NODE_ENV === 'prod'
//   //   ? process.env.DB_HOST_PROD
//   //   : process.env.DB_HOST_DEV) as string,
//   // ssl: process.env.NODE_ENV === 'prod' ? sslConectionOptions : false,

//   constructor() {
//     // from(this.setUpPool()).subscribe({
//     //   next: (x) => {
//     //     x.on('connect', () => {
//     //       info(`connected`);
//     //     });
//     //     this.query = async (text: string, params?: any) => {
//     //       info(`Executed query: ${text}`);
//     //       return x.query(text, params);
//     //     };
//     //   },
//     //   error: (err) => error(err),
//     // });
//   }

//   // getMainPosts = async (req: Request, res: Response) => {
//   //   from(this.setUpPool()).subscribe({
//   //     next: async (driverOpts) => {
//   //       debug({ driverOpts });

//   //       const dbConfig: ClientConfig = {
//   //         port: 5432,
//   //         database: process.env.DB_NAME,
//   //         user: process.env.DB_USER,
//   //         password:
//   //           process.env.NODE_ENV === 'prod'
//   //             ? process.env.DB_PASS_PROD
//   //             : process.env.DB_PASS_DEV,
//   //         ...driverOpts,
//   //       };

//   //       const pool = new Pool(dbConfig);

//   //       debug({ pool });
//   //       const posts = await pool.query(
//   //         'select post_list.id, post_list.type from post_list inner join main_feed on main_feed.post_id=post_list.id'
//   //       );
//   //       debug(posts);
//   //       pool.end()
//   //       this.connectorInstance.close();
//   //       res.status(200);
//   //     },
//   //     error: (err) => {
//   //       error(err);
//   //       res.status(400).json(err);
//   //     }
//   //   });

//   //   // const query = async (text: string, params?: any) => {
//   //   //   info(`Executed query: ${text}`);
//   //   //   return x.query(text, params);
//   //   // };

//   //   //   debug({ mainPosts });
//   //   //   if (mainPosts) {
//   //   //     const fullPostArray: any[] = [];
//   //   //     for (const row of mainPosts.rows) {
//   //   //       let result;
//   //   //       if (row.type === 'text') {
//   //   //         result = await pool.query(
//   //   //           'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
//   //   //           [row.id]
//   //   //         );
//   //   //       } else {
//   //   //         result = await pool.query(
//   //   //           'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
//   //   //           [row.id]
//   //   //         );
//   //   //       }
//   //   //       fullPostArray.push(result.rows[0]);
//   //   //     }
//   //   //     // mainPosts.rows.forEach((row) => {
//   //   //     //   const result = query('select * from post_list where id=$1', [row.post_id]);
//   //   //     //   fullPostArray.push(result);
//   //   //     // })
//   //   //     console.table(fullPostArray);
//   //   //     await pool.end();
//   //   //     this.connectorInstance.close();
//   //   //     res.status(200).json(fullPostArray);
//   //   //   } else throw Error('failed');
//   //   // }
//   // };

//   // getPuppyPosts = async (req: Request, res: Response) => {
//   //   try {
//   //     const mainPosts = await this.query(
//   //       'select post_list.id, post_list.type from post_list inner join puppy_feed on puppy_feed.post_id=post_list.id'
//   //     );
//   //     if (mainPosts) {
//   //       const fullPostArray: any[] = [];
//   //       for (const row of mainPosts.rows) {
//   //         let result;
//   //         if (row.type === 'text') {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         } else {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         }
//   //         fullPostArray.push(result?.rows[0]);
//   //       }

//   //       res.status(200).json(fullPostArray);
//   //     }
//   //   } catch (err) {
//   //     error(err);
//   //     res.status(400).json(err);
//   //   }
//   // };

//   // getArticlePosts = async (req: Request, res: Response) => {
//   //   try {
//   //     const mainPosts = await this.query(
//   //       'select post_list.id, post_list.type from post_list inner join articles_feed on articles_feed.post_id=post_list.id'
//   //     );
//   //     if (mainPosts) {
//   //       const fullPostArray: any[] = [];
//   //       for (const row of mainPosts.rows) {
//   //         let result;
//   //         if (row.type === 'text') {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         } else {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         }
//   //         fullPostArray.push(result?.rows[0]);
//   //       }

//   //       res.status(200).json(fullPostArray);
//   //     }
//   //   } catch (err) {
//   //     error(err);
//   //     res.status(400).json(err);
//   //   }
//   // };

//   // getApplePosts = async (req: Request, res: Response) => {
//   //   try {
//   //     const mainPosts = await this.query(
//   //       'select post_list.id, post_list.type from post_list inner join apple_feed on apple_feed.post_id=post_list.id'
//   //     );
//   //     if (mainPosts) {
//   //       const fullPostArray: any[] = [];
//   //       for (const row of mainPosts.rows) {
//   //         let result;
//   //         if (row.type === 'text') {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         } else {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         }
//   //         fullPostArray.push(result?.rows[0]);
//   //       }

//   //       res.status(200).json(fullPostArray);
//   //     }
//   //   } catch (err) {
//   //     error(err);
//   //     res.status(400).json(err);
//   //   }
//   // };

//   // getBlockchainPosts = async (req: Request, res: Response) => {
//   //   try {
//   //     const mainPosts = await this.query(
//   //       'select post_list.id, post_list.type from post_list inner join blockchain_feed on blockchain_feed.post_id=post_list.id'
//   //     );
//   //     if (mainPosts) {
//   //       const fullPostArray: any[] = [];
//   //       for (const row of mainPosts.rows) {
//   //         let result;
//   //         if (row.type === 'text') {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         } else {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         }
//   //         fullPostArray.push(result?.rows[0]);
//   //       }

//   //       res.status(200).json(fullPostArray);
//   //     }
//   //   } catch (err) {
//   //     error(err);
//   //     res.status(400).json(err);
//   //   }
//   // };

//   // getAnimePosts = async (req: Request, res: Response) => {
//   //   try {
//   //     const mainPosts = await this.query(
//   //       'select post_list.id, post_list.type from post_list inner join anime_feed on anime_feed.post_id=post_list.id'
//   //     );
//   //     if (mainPosts) {
//   //       const fullPostArray: any[] = [];
//   //       for (const row of mainPosts.rows) {
//   //         let result;
//   //         if (row.type === 'text') {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         } else {
//   //           result = await this.query(
//   //             'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
//   //             [row.id]
//   //           );
//   //         }
//   //         fullPostArray.push(result?.rows[0]);
//   //       }

//   //       res.status(200).json(fullPostArray);
//   //     }
//   //   } catch (err) {
//   //     error(err);
//   //     res.status(400).json(err);
//   //   }
//   // };
// }

class testDB {
  static count = 0;
  static async getMainPosts(req: Request, res: Response) {
    testDB.count++;
    const connector = new Connector();

    connector
      .getOptions({
        instanceConnectionName: 'jlz-portfolio:us-central1:jz-dev',
        ipType: IpAddressTypes.PUBLIC,
      })
      .then(async (clientOpts) => {
        const pool = new Pool({
          ...clientOpts,
          application_name: 'jzp',
          log: debug,
          statement_timeout: 10000,
          query_timeout: 10000,
          port: 5432,
          user: 'postgres',
          password: '2WP4o9etoPDw@pKc',
          database: 'jz-dev',
          max: 5,
        });

        info(testDB.count, pool.waitingCount, pool.totalCount);

        
        pool
          .query('select post_list.id, post_list.type from post_list', (err, result) => {
             debug('yup', err);
             console.table(result);
             res.status(200).json(result);
          })
         
      })
      .catch((err) => {
        res.status(413).json(err);
      });
    connector.close();
  }
}

export const postRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const dbManager = new testDB();

async function db(){
  return 'meep'
}

await db();

// postRouter.get('/main', dbManager.getMainPosts);
// postRouter.get('/puppy', dbManager.getPuppyPosts);
// postRouter.get('/articles', dbManager.getArticlePosts);
// postRouter.get('/apple', dbManager.getApplePosts);
// postRouter.get('/blockchain', dbManager.getBlockchainPosts);
// postRouter.get('/anime', dbManager.getAnimePosts);
