/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import * as fbAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import * as cors from 'cors';

const a = fbAdmin.initializeApp();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const secretNameDev =
  'projects/518070660509/secrets/LINK_PREVIEW_DEV/versions/latest';
const secretNameProd =
  'projects/518070660509/secrets/LINK_PREVIEW_PROD/versions/latest';

const app = express();
const secretRouter = express.Router();

app.use(cors());

const getSecret = async (req: Request, res: Response) => {
  try {
    const [apiKey] = await new SecretManagerServiceClient().accessSecretVersion(
      {
        name: req.params.prod ? secretNameProd : secretNameDev,
      }
    );
    res.status(200).json({ k: apiKey.payload?.data?.toString() });
  } catch (error) {
    console.error(error);
  }
};

const appCheckGaurd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');
  const appCheckDebugToken = req.header('X-Firebase-AppCheck-Debug');

  if (appCheckDebugToken) {
    return next();
  } else if (!appCheckToken) {
    res.status(401);
    return next('Unauthorized');
  } else {
    try {
      await a.appCheck().verifyToken(appCheckToken);
      return next();
    } catch (err) {
      console.log(err);
      res.status(401);
      return next('Unauthorized');
    }
  }
};

secretRouter.get('/secrets', getSecret);

app.use('/api/v1', appCheckGaurd, secretRouter);

export const secretService = functions.https.onRequest(app);
