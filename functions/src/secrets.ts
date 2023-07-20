/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { error, debug } from 'firebase-functions/logger';
import * as express from 'express';
import { Request, Response } from 'express';
// import { applicationDefault } from 'firebase-admin/app';
import { defineSecret } from 'firebase-functions/params';
import { SecretParam } from 'firebase-functions/lib/params/types';

export const secretNameDev = defineSecret('LINK_PREVIEW_DEV');
export const secretNameProd = defineSecret('LINK_PREVIEW_PROD');
export const clientKey = defineSecret('JLZ-APP-CLIENT-KEY');
export const clientCert = defineSecret('JLZ-APP-CLIENT-CERT');
export const serverCA = defineSecret('JLZ-APP-SERVER-CA');

export const secretRouter = express.Router();

export const secretArray: SecretParam[] = [
  secretNameDev,
  secretNameProd,
  clientCert,
  clientKey,
  serverCA,
];

const getLinkPreviewSecret = async (req: Request, res: Response) => {
  try {
    const isProd: boolean = req.query.prod === 'true';
    const apiKey = isProd ? secretNameProd.value() : secretNameDev.value();
    debug({
      y: isProd,
      t: req.query.prod,
      a: secretNameProd.value(),
      b: secretNameDev.value(),
      g: apiKey,
    });
    debug({ k: apiKey });
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
        debug(secretNameProd.value());
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
