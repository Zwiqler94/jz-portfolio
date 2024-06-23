/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from 'firebase-functions/logger';
import express, { Request, Response } from 'express';
import { secretArray, secretName } from '.';

export const secretRouter = express.Router();

export const getLinkPreviewSecret = async (req: Request, res: Response) => {
  try {
    const isProd = req.query.prod === 'true';
    const apiKey = secretName.value();
    res.status(200).json({ k: apiKey });
  } catch (err) {
    error(err);
    res.status(400);
  }
};

export const getSecret = async (req: Request, res: Response) => {
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
