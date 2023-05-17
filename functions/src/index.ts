/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import * as fbAdmin from 'firebase-admin';
import {onRequest} from 'firebase-functions/v2/https';
import { error, debug } from 'firebase-functions/logger';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import * as cors from 'cors';
// import { applicationDefault } from 'firebase-admin/app';
import * as creds from '../credentials.json';
import { defineSecret } from 'firebase-functions/params';

const fbAdminApp = fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert({
    clientEmail: creds.client_email,
    privateKey: creds.private_key,
    projectId: creds.project_id,
  }),
});

const secretNameDev = defineSecret('LINK_PREVIEW_DEV')
const secretNameProd = defineSecret('LINK_PREVIEW_PROD');
  

const secretsApp = express();
const secretRouter = express.Router();

secretsApp.use(cors());

const getSecret = async (req: Request, res: Response) => {
  try {
    const apiKey = req.params.prod ? secretNameProd : secretNameDev;
    debug({ k: apiKey });
    res.status(200).json({ k: apiKey });
  } catch (err) {
    error(err);
    res.status(400);
  }
};

const appCheckGaurd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');
  const appCheckDebugToken = req.header('X-Firebase-AppCheck-Debug');
  const tokenToCheck = appCheckToken ? appCheckToken : appCheckDebugToken;
  debug({ tokenToCheck, creds, fbAdminApp });
  if (!tokenToCheck) {
    res.status(401);
    return next('unauthorized A');
  }

  try {
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await fbAdminApp.appCheck().verifyToken(tokenToCheck);
    debug({ a:result.token });
    return next();
  } catch (err) {
    error(err);
    res.status(401);
    return next('unauthorized B');
  }
};

secretRouter.get('/secrets', getSecret);

secretsApp.use('/api/v2', appCheckGaurd, secretRouter);

const link

export const secretService2ndGen = onRequest({ cors: true, secrets: [secretNameDev, secretNameProd] }, secretsApp);

