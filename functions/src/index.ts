/* eslint-disable new-cap */
import { onRequest } from 'firebase-functions/v2/https';
import {
  awsAccessKey,
  awsSecretKey,
  clientCert,
  clientKey,
  dbHostDev,
  dbHostProd,
  dbPassDev,
  dbPassProd,
  secretNameDev,
  secretNameProd,
  secretRouter,
  serverCA,
} from './secrets';
// import { limiter } from './middleware';
import { postRouter } from './db';
import cors = require('cors');
import express = require('express');
// import {getFunctions, connectFunctionsEmulator} from "firebase/functions";
import { cert, initializeApp } from 'firebase-admin/app';
import * as creds from '../credentials.json';
import { debug } from 'firebase-functions/logger';
import { appCheckGaurd, limiter } from './middleware';

// import {getAuth, connectAuthEmulator} from "firebase/auth";

// const auth = getAuth();
// connectAuthEmulator(auth, "http://127.0.0.1:9099");

// const functions = getFunctions();

// connectFunctionsEmulator(functions, "http://127.0.0.1", 5001);

// This is from MEGA-FEATURE-BRANCH

export const fbAdminApp = initializeApp({
  credential: cert({
    clientEmail: creds.client_email,
    privateKey: creds.private_key,
    projectId: creds.project_id,
  }),
});

const app = express();
app.use(cors());
app.use(limiter);
app.set('trust proxy', 1);
const jzPortfolioBackendExpressApp = express.Router();
const gaurdedRoutes = express.Router().use(appCheckGaurd);

app.use('/api/v3', jzPortfolioBackendExpressApp);

gaurdedRoutes.use(secretRouter);
gaurdedRoutes.use('/posts', postRouter);

jzPortfolioBackendExpressApp.get('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  };

  res.status(200).send(data);
});

jzPortfolioBackendExpressApp.get('/x-forwarded-for', (request, response) =>
  response.send(request.headers['x-forwarded-for']),
);

jzPortfolioBackendExpressApp.use(gaurdedRoutes);

export const jzPortfolioApp = onRequest(
  {
    maxInstances: 5,
    timeoutSeconds: 3600,
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets: [
      secretNameDev,
      secretNameProd,
      clientCert,
      clientKey,
      serverCA,
      dbPassDev,
      dbPassProd,
      dbHostDev,
      dbHostProd,
      awsAccessKey,
      awsSecretKey,
    ],
  },
  app,
);
