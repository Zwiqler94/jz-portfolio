/* eslint-disable new-cap */
import { onRequest } from 'firebase-functions/v2/https';
import { postRouter } from './db';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import { cert, initializeApp } from 'firebase-admin/app';
import * as creds from '../credentials.json';
import { appCheckGaurd, limiter } from './middleware';
import helmet from 'helmet';
import { error } from 'firebase-functions/logger';
import { Firestore } from '@google-cloud/firestore';
import { FirestoreStore } from '@google-cloud/connect-firestore';
import session from 'express-session';
import compression from 'compression';

import { defineSecret } from 'firebase-functions/params';
import { SecretParam } from 'firebase-functions/lib/params/types';
import { secretRouter } from './secrets';
import { SwaggerUiOptions, serve, setup } from 'swagger-ui-express';
import swaggerDoc from '../JAZWICKLER-JLZ-5.1.7-swagger.json';
import { authRouter } from './auth';

export const fbAdminApp = initializeApp({
  credential: cert({
    clientEmail: creds.client_email,
    privateKey: creds.private_key,
    projectId: creds.project_id,
  }),
});

const app = express();

// var options: SwaggerUiOptions = {

//   // swaggerOptions: {
//   //   url: '/api-docs/swagger.json',
//   // },
// };
// app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDoc));
app.use('/api-docs', serve, setup(swaggerDoc));

app.use(compression());

let SESSION_SECRETS = ['XYX9c8fenuicvn948bnvu8'];

if (process.env.SESSION_SECRET) {
  SESSION_SECRETS = [process.env.SESSION_SECRET, ...SESSION_SECRETS];
}

const sessionOpts: session.SessionOptions = {
  store: new FirestoreStore({
    dataset: new Firestore(),
    kind: 'express-sessions',
  }),
  name: `jlz_portfolio_${process.env.DB_ENV}_${process.env.DB_USER}`,
  secret: SESSION_SECRETS,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true, //app.get('env') === 'production',
    httpOnly: false,
    domain: 'localhost',
    priority: 'high',
    // path: "/cookie/",
    sameSite: 'none',
  },
};

const corsOpts: CorsOptions = {
  origin: ['http://localhost'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  exposedHeaders: ['X-Ratelimit-Limit', 'Set-Cookie'],
  allowedHeaders: [
    'Set-Cookie',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  credentials: true,
};

app.use(cors(corsOpts));
app.use(session(sessionOpts));

// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization,
app.use(helmet());
app.use(limiter);
app.set('trust proxy', 1);
app.set('X-Powered-By', false);

const jzPortfolioBackendExpressApp = express.Router();
const gaurdedRoutes = express.Router().use(appCheckGaurd);

app.use('/api/v3', jzPortfolioBackendExpressApp);

const clientCert = defineSecret('JLZ_APP_CLIENT_CERT');
const clientKey = defineSecret('JLZ_APP_CLIENT_KEY');
const dbPass =
  app.get('env') === 'production'
    ? defineSecret('DB_PASS_PROD')
    : defineSecret('DB_PASS_DEV');
const dbHost =
  app.get('env') === 'production'
    ? defineSecret('DB_HOST_PROD')
    : defineSecret('DB_HOST_DEV');
const secretName =
  app.get('env') === 'production'
    ? defineSecret('LINK_PREVIEW_PROD')
    : defineSecret('LINK_PREVIEW_DEV');
const serverCA = defineSecret('JLZ_APP_SERVER_CA');
const awsAccessKey = defineSecret('AWS_ACCESS_KEY_ID');
const awsSecretKey = defineSecret('AWS_SECRET_ACCESS_KEY');

const secretArray: SecretParam[] = [
  clientCert,
  clientKey,
  dbPass,
  dbHost,
  secretName,
  serverCA,
];

gaurdedRoutes.use(secretRouter);
gaurdedRoutes.use('/posts', postRouter);

jzPortfolioBackendExpressApp.get('/health', (req, res) => {
  console.log(app.get('env'), JSON.stringify(dbHost.value()));
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

jzPortfolioBackendExpressApp.use('/auth', authRouter);

jzPortfolioBackendExpressApp.use(gaurdedRoutes);

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.status(404).send("404: Sorry can't find that!");
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    error(err.stack);
    res.status(500).send('500: Something broke!');
  },
);

export const jzPortfolioApp = onRequest(
  {
    maxInstances: 5,
    timeoutSeconds: 3600,
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets: [
      clientCert,
      clientKey,
      serverCA,

      defineSecret('DB_PASS_PROD'),
      defineSecret('DB_HOST_PROD'),
      defineSecret('LINK_PREVIEW_PROD'),
      awsAccessKey,
      awsSecretKey,
    ],
  },
  app,
);

export const jzPortfolioAppDev = onRequest(
  {
    maxInstances: 5,
    timeoutSeconds: 3600,
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets: [
      clientCert,
      clientKey,
      serverCA,
      defineSecret('DB_PASS_DEV'),
      defineSecret('DB_HOST_DEV'),
      defineSecret('LINK_PREVIEW_DEV'),
      awsAccessKey,
      awsSecretKey,
    ],
  },
  app,
);

export { secretArray, secretName };
