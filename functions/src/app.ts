/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';

import { setupMiddleware } from './middleware/general.middleware';
import { devApp } from './routes/dev.routes';
import { prodApp } from './routes/prod.routes';
import { setupSecretRoutes } from './secret-config';

// Create Express app for v3
export const createAppV3 = (): express.Express => {
  const appV3 = express();
  setupMiddleware(appV3); // Apply shared middleware
  setupSecretRoutes(prodApp, appV3.get('env'));
  appV3.use('/api/v3', prodApp); // Mount v3 routes
  appV3.use((req, res, next) => {
    res.status(404).send("404: Sorry can't find that!");
  });

  return appV3;
};

// Create Express app for v4
export const createAppV4 = (): express.Express => {
  const appV4 = express();
  setupMiddleware(appV4); // Apply shared middleware
  setupSecretRoutes(devApp, appV4.get('env'));
  appV4.use('/api/v4', devApp); // Mount v4 routes
  appV4.use((req, res, next) => {
    res.status(404).send("404: Sorry can't find that!");
  });

  return appV4;
};
