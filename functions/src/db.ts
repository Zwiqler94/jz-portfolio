import express = require('express');
import { Request, Response } from 'express';
import { Pool, ClientConfig } from 'pg';

export const postRouter = express.Router();

const dbConfig: ClientConfig = {
  database: 'jz-local',
  user: 'postgres',
  password: 'r9Ptp.hhwk-.c.748F!6',
  host: 'localhost',
  ssl: false,
};

const pool: Pool = new Pool(dbConfig);
pool.on('connect', () => console.log('connected'));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = async (text: string, params?: any) => pool.query(text, params);

const getMainPosts = async (req: Request, res: Response) => {
  try {
    const mainPosts = await query('select post_list.id, post_list.type from post_list inner join main_feed on main_feed.post_id=post_list.id');
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

const getPuppyPosts = async (req: Request, res: Response) => {
  try {
    const mainPosts = await query('select post_list.id, post_list.type from post_list inner join puppy_feed on puppy_feed.post_id=post_list.id');
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

postRouter.get('/main', getMainPosts);
postRouter.get('/puppy', getPuppyPosts);
postRouter.get('/articles', getArticlePosts);
