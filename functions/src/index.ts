/* eslint-disable new-cap */
import { onRequest } from 'firebase-functions/v2/https';
import {
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
import { limiter } from './middleware';
import { postRouter } from './db';
import * as cors from 'cors';
import * as express from 'express';
// import {getFunctions, connectFunctionsEmulator} from "firebase/functions";
import { cert, initializeApp } from 'firebase-admin/app';
import * as creds from '../credentials.json';

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
// app.enable('trust proxy');
const jzPortfolioBackendExpressApp = express.Router();

app.use('/api/v3', limiter, jzPortfolioBackendExpressApp);
jzPortfolioBackendExpressApp.use(secretRouter);
jzPortfolioBackendExpressApp.use('/posts', postRouter);
jzPortfolioBackendExpressApp.use('/health', (req, res) =>
  res.send("I'm alive!"),
);


export const jzPortfolioApp = onRequest(
  {
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
    ],
  },
  app,
);
