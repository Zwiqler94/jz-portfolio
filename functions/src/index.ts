/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import * as functions from 'firebase-functions';
import * as express from 'express';
import { Request, Response } from 'express';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import * as cors from 'cors';

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

app.use(cors())

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

app.get('/', getSecret);

export const secretService = functions.https.onRequest(app);
