import { DBController } from '../controllers/db.controller';
import { PostController } from '../controllers/post.controller';
import { validator } from '../middleware/general.middleware';
import { postValidator } from '../validators/post.validator';
import { Router } from 'express';

const prodApp = Router();
const postsRouter = Router();
const dbController = new DBController();
const postController = new PostController(dbController);

postsRouter.get('/main', postController.getMainPosts);
postsRouter.get('/puppy', postController.getPuppyPosts);
postsRouter.get('/articles', postController.getArticlePosts);
postsRouter.get('/apple', postController.getApplePosts);
postsRouter.get('/blockchain', postController.getBlockchainPosts);
postsRouter.get('/anime', postController.getAnimePosts);
// postRouter.post('/hash', postValidator, dbManager.hashPost);
postsRouter.post('/', postValidator, validator, postController.createPost);

// Mount routes for v4
prodApp.use('/posts', postsRouter);

export { prodApp };
