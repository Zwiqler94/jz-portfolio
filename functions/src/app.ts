import express from 'express';

import {
  setupErrorHandling,
  setupMiddleware,
} from './middleware/general.middleware';
import { createApiRouter } from './routes/api.routes';

// Create Express app for v4
export const createAppV4 = (): express.Express => {
  const appV4 = express();
  setupMiddleware(appV4); // Apply shared middleware
  appV4.use('/api/v4', createApiRouter(appV4.get('env'))); // Mount v4 routes
  appV4.use((_req, res) => {
    res.status(404).send("404: Sorry can't find that!");
  });
  setupErrorHandling(appV4);

  return appV4;
};
