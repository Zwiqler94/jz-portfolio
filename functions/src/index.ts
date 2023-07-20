import cors = require('cors');
import express = require('express');
import { onRequest } from 'firebase-functions/v2/https';
import {
  clientCert,
  clientKey,
  secretNameDev,
  secretNameProd,
  secretRouter,
  serverCA,
} from './secrets';
import { limiter } from './middleware';
import { postRouter } from './db';

// This is from Branch JZ-269-135

const app = express();
app.use(cors());
const jzPortfolioBackendExpressApp = express.Router();

app.use('/api/v3', limiter, jzPortfolioBackendExpressApp);
jzPortfolioBackendExpressApp.use(secretRouter);
jzPortfolioBackendExpressApp.use('/posts', postRouter);

export const jzPortfolioApp = onRequest(
  {
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets: [secretNameDev, secretNameProd, clientCert, clientKey, serverCA],
  },
  app,
);
