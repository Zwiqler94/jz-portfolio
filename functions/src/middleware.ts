import { getAppCheck } from 'firebase-admin/app-check';

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { debug, error } from 'firebase-functions/logger';
import { rateLimit } from 'express-rate-limit';
import { validationResult } from 'express-validator';

export const appCheckGaurd = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');
  // const appCheckDebugToken = req.header('X-Firebase-AppCheck');
  const tokenToCheck = appCheckToken; //? appCheckToken : appCheckDebugToken;
  if (!tokenToCheck) {
    res.status(401);
    return next('Unauthorized Code: No Token');
  }

  // debug({ tokenToCheck });

  try {
    /* eslint-disable-next-line */
    // if (appCheckToken) {

    await getAppCheck().verifyToken(tokenToCheck);

    // } else {
    //    return next('');
    // }

    // if (appCheckDebugToken && !appCheckToken) {
    //   debug('DEBUG TOKEN USED');
    // }
    next();
  } catch (err: any) {
    // error(err);
    res.status(401);
    next(`Unauthorized Code: Error ${err.message}`);
  }
  // next();
};

export const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  validate: { ip: false },
});

export const validator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  } else {
    error(result.array);
    return res.status(400).json({ errors: result.array() });
  }
};

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  error(err.stack);
  return res.status(res.statusCode).json({
    name: err.name,
    code: res.statusCode,
    description: err.message ? err.message : err,
    stack: err.stack,
  });
};
