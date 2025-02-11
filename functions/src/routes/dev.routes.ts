import { validator } from '../middleware/general.middleware';
import { postValidator } from '../validators/post.validator';
import { DBController } from '../controllers/db.controller';
import { Router } from 'express';
import { LinkPreviewController } from '../controllers/link-preview.controller';
import { PostController } from '../controllers/post.controller';

const devApp = Router();
const postsRouter = Router();
const previewRouter = Router();
const dbController = new DBController();
const linkPC = new LinkPreviewController(dbController);
const postController = new PostController(dbController);

postsRouter.get('/:feedType', postController.getPosts);
postsRouter.post('/', postValidator, validator, postController.createPost);
previewRouter.post('/', linkPC.storeLinkPreview);
previewRouter.get('/:id', linkPC.getLinkPreview);

// Mount routes for v4
devApp.use('/posts', postsRouter);
devApp.use('/previews', previewRouter);

export { devApp };
