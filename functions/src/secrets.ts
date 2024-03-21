/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from 'firebase-functions/logger';
import * as express from 'express';
import { Request, Response } from 'express';
import { defineSecret } from 'firebase-functions/params';
import { SecretParam } from 'firebase-functions/lib/params/types';
// import { SecretParam } from 'firebase-functions/lib/params/types';

export const clientCert = defineSecret('JLZ_APP_CLIENT_CERT');
export const clientKey = defineSecret('JLZ_APP_CLIENT_KEY');
export const dbPassDev = defineSecret('DB_PASS_DEV');
export const dbPassProd = defineSecret('DB_PASS_PROD');
export const dbHostDev = defineSecret('DB_HOST_DEV');
export const dbHostProd = defineSecret('DB_HOST_PROD');
export const secretNameDev = defineSecret('LINK_PREVIEW_DEV');
export const secretNameProd = defineSecret('LINK_PREVIEW_PROD');
export const serverCA = defineSecret('JLZ_APP_SERVER_CA');
export const awsAccessKey = defineSecret('AWS_ACCESS_KEY_ID');
export const awsSecretKey = defineSecret('AWS_SECRET_ACCESS_KEY');

export const secretRouter = express.Router();

export const secretArray: SecretParam[] = [
  clientCert,
  clientKey,
  dbPassDev,
  dbPassProd,
  dbHostDev,
  dbHostProd,
  secretNameDev,
  secretNameProd,
  serverCA,
];

const getLinkPreviewSecret = async (req: Request, res: Response) => {
  try {
    const isProd: boolean = req.query.prod === 'true';
    const apiKey = isProd ? secretNameProd.value() : secretNameDev.value();
    // debug({
    //   y: isProd,
    //   t: req.query.prod,
    //   a: secretNameProd.value(),
    //   b: secretNameDev.value(),
    //   g: apiKey,
    // });
    // debug({ k: apiKey });
    res.status(200).json({ k: apiKey });
  } catch (err) {
    error(err);
    res.status(400);
  }
};

const getSecret = async (req: Request, res: Response) => {
  try {
    const secretName = secretArray.filter((secret) => {
      if (secret.name === req.params.name) {
        // debug(secretNameProd.value());
        return true;
      }
      return false;
    });

    res.status(200).json({ k: secretName[0].value() });
  } catch (err) {
    error(err);
    res.status(400);
  }
};

secretRouter.get('/secrets/link-previews', getLinkPreviewSecret);
secretRouter.get('/secrets/:name', getSecret);
