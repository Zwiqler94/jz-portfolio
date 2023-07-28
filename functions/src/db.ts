/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
import { Router, Request, Response } from 'express';
import { Pool, ClientConfig, QueryResult } from 'pg';

export const postRouter = Router();

const dbConfig: ClientConfig = {
  database:process.env.DB_NAME ,
  user: process.env.DB_USER,
  password:
    process.env.NODE_ENV === 'prod'
      ? process.env.DB_PASS_PROD
      : process.env.DB_PASS_DEV,
  host:process.env.DB_HOST,
  // ssl: {
  //   rejectUnauthorized: false,
  //   ca: process.env.JLZ_APP_SERVER_CA,
  //   key: process.env.JLZ_APP_CLIENT_KEY,
  //   cert: process.env.JLZ_APP_CLIENT_CERT,
  // },
};

const pool: Pool = new Pool(dbConfig);
pool.on('connect', () => {
  console.log('connected');
  console.log({ isSSL: dbConfig.ssl ? true : false });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = async (text: string, params?: any) => pool.query(text, params);

const getMainPosts = async (req: Request, res: Response) => {
  try {
    const mainPosts: QueryResult<any> | void = await query(
      'select post_list.id, post_list.type from post_list inner join main_feed on main_feed.post_id=post_list.id'
    ).catch((err) => console.log(err));
    if (mainPosts) {
      const fullPostArray: any[] = [];
      for (const row of mainPosts.rows) {
        let result;
        if (row.type === 'text') {
          result = await query(
            'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
            [row.id]
          );
        } else {
          result = await query(
            'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
            [row.id]
          );
        }
        fullPostArray.push(result.rows[0]);
      }
      // mainPosts.rows.forEach((row) => {
      //   const result = query('select * from post_list where id=$1', [row.post_id]);
      //   fullPostArray.push(result);
      // })
      res.status(200).json(fullPostArray);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

const getPuppyPosts = async (req: Request, res: Response) => {
  try {
    const mainPosts = await query(
      'select post_list.id, post_list.type from post_list inner join puppy_feed on puppy_feed.post_id=post_list.id'
    );
    const fullPostArray: any[] = [];
    for (const row of mainPosts.rows) {
      let result;
      if (row.type === 'text') {
        result = await query(
          'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      } else {
        result = await query(
          'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      }
      fullPostArray.push(result.rows[0]);
    }
    // mainPosts.rows.forEach((row) => {
    //   const result = query('select * from post_list where id=$1', [row.post_id]);
    //   fullPostArray.push(result);
    // })
    res.status(200).json(fullPostArray);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

const getArticlePosts = async (req: Request, res: Response) => {
  try {
    const mainPosts = await query(
      'select post_list.id, post_list.type from post_list inner join articles_feed on articles_feed.post_id=post_list.id'
    );
    const fullPostArray: any[] = [];
    for (const row of mainPosts.rows) {
      let result;
      if (row.type === 'text') {
        result = await query(
          'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      } else {
        result = await query(
          'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      }
      fullPostArray.push(result.rows[0]);
    }
    // mainPosts.rows.forEach((row) => {
    //   const result = query('select * from post_list where id=$1', [row.post_id]);
    //   fullPostArray.push(result);
    // })
    res.status(200).json(fullPostArray);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

const getApplePosts = async (req: Request, res: Response) => {
  try {
    const mainPosts = await query(
      'select post_list.id, post_list.type from post_list inner join apple_feed on apple_feed.post_id=post_list.id'
    );
    const fullPostArray: any[] = [];
    for (const row of mainPosts.rows) {
      let result;
      if (row.type === 'text') {
        result = await query(
          'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      } else {
        result = await query(
          'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      }
      fullPostArray.push(result.rows[0]);
    }
    // mainPosts.rows.forEach((row) => {
    //   const result = query('select * from post_list where id=$1', [row.post_id]);
    //   fullPostArray.push(result);
    // })
    res.status(200).json(fullPostArray);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

const getBlockchainPosts = async (req: Request, res: Response) => {
  try {
    const mainPosts = await query(
      'select post_list.id, post_list.type from post_list inner join blockchain_feed on blockchain_feed.post_id=post_list.id'
    );
    const fullPostArray: any[] = [];
    for (const row of mainPosts.rows) {
      let result;
      if (row.type === 'text') {
        result = await query(
          'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      } else {
        result = await query(
          'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      }
      fullPostArray.push(result.rows[0]);
    }
    // mainPosts.rows.forEach((row) => {
    //   const result = query('select * from post_list where id=$1', [row.post_id]);
    //   fullPostArray.push(result);
    // })
    res.status(200).json(fullPostArray);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

const getAnimePosts = async (req: Request, res: Response) => {
  try {
    const mainPosts = await query(
      'select post_list.id, post_list.type from post_list inner join anime_feed on anime_feed.post_id=post_list.id'
    );
    const fullPostArray: any[] = [];
    for (const row of mainPosts.rows) {
      let result;
      if (row.type === 'text') {
        result = await query(
          'select post_list.id, post_list.type, text_post.title, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join text_post on post_list.id=text_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      } else {
        result = await query(
          'select post_list.id, post_list.type, link_post.uri, post_list.content ,post_list.created_at, post_list.updated_at from post_list inner join link_post on post_list.id=link_post.list_id where post_list.id=$1 ',
          [row.id]
        );
      }
      fullPostArray.push(result.rows[0]);
    }
    // mainPosts.rows.forEach((row) => {
    //   const result = query('select * from post_list where id=$1', [row.post_id]);
    //   fullPostArray.push(result);
    // })
    res.status(200).json(fullPostArray);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

postRouter.get('/main', getMainPosts);
postRouter.get('/puppy', getPuppyPosts);
postRouter.get('/articles', getArticlePosts);
postRouter.get('/apple', getApplePosts);
postRouter.get('/blockchain', getBlockchainPosts);
postRouter.get('/anime', getAnimePosts);
