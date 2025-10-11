import { error } from 'firebase-functions/logger';
import { NextFunction, Request, Response } from 'express';
import { getLinkPreviewSecretSetup, getSecrets } from '../secret-config';

export class SecretController {
  private secrets;
  private lpSecret;

  constructor(env: string) {
    this.secrets = getSecrets(env);
    this.lpSecret = getLinkPreviewSecretSetup(env);
  }

  getLinkPreviewSecret = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const apiKey = this.lpSecret.value();
      res.status(200).json({ k: apiKey });
    } catch (err) {
      error(err);
      res.status(400);
      next(err);
    }
  };

  getSecret = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const secretName = this.secrets.filter((secret) => {
        if (secret.name === req.params.name) {
          return true;
        }
        return false;
      });

      res.status(200).json({ k: secretName[0].value() });
    } catch (err) {
      error(err);
      res.status(400);
      next(err);
    }
  };
}
