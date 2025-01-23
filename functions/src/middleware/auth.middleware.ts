import express, { NextFunction, Request, Response } from 'express';
import { getAppCheck } from 'firebase-admin/app-check';
import { debug, error } from 'firebase-functions/logger';
import { authValidator } from '../validators/auth.validator';
import { authGuard } from './general.middleware';

export const authRouter = express.Router();

const tokenGenerator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  debug('meeep');
  try {
    const appToken = await getAppCheck().createToken(
      '1:518070660509:web:9d2511d1a027342457d374',
    );
    res.status(201).json({ token: appToken.token });
  } catch (err) {
    error(err);
    res.status(500).json(err);
    next(err);
  }
};

authRouter.get('/token', authValidator, authGuard, tokenGenerator); //basicAuth({ authorizer }), tokenGenerator);
