import { Router } from 'express';
import {
  appCheckGaurd,
  validator,
} from '../middleware/general.middleware';
import { postValidator } from '../validators/post.validator';
import { DBController } from '../controllers/db.controller';
import { LinkPreviewController } from '../controllers/link-preview.controller';
import { PostController } from '../controllers/post.controller';
import { setupSecretRoutes } from '../secret-config';

export const createApiRouter = (env: string): Router => {
  const apiRouter = Router();
  const postsRouter = Router();
  const previewRouter = Router();
  const dbController = new DBController();
  const linkPC = new LinkPreviewController(dbController);
  const postController = new PostController(dbController);

  if (process.env.NODE_ENV === 'production') {
    apiRouter.use(appCheckGaurd);
  }

  setupSecretRoutes(apiRouter, env);

  postsRouter.get('/:feedType', postController.getPosts);
  postsRouter.post('/', postValidator, validator, postController.createPost);

  previewRouter.post('/', linkPC.storeLinkPreview);
  previewRouter.get('/:id', linkPC.getLinkPreview);

  apiRouter.use('/posts', postsRouter);
  apiRouter.use('/previews', previewRouter);

  return apiRouter;
};
