import { getAppCheck } from 'firebase-admin/app-check';
import { Request, Response, NextFunction } from 'express';
import { debug, error } from 'firebase-functions/logger';
import { rateLimit } from 'express-rate-limit';
import { validationResult } from 'express-validator';

export const appCheckGaurd = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');
  const appCheckDebugToken = req.header('X-Firebase-Appcheck-Debug');
  const tokenToCheck = appCheckToken ? appCheckToken : appCheckDebugToken;
  if (!tokenToCheck) {
    res.status(401);
    return next('Unauthorized Code: A');
  }

  try {
    /* eslint-disable-next-line */
    if (!appCheckDebugToken && appCheckToken) {
      const _result = await getAppCheck().verifyToken(tokenToCheck);
      debug('Audience', _result.token.aud);
    } else if (appCheckDebugToken && !appCheckToken) {
      debug('DEBUG TOKEN USED');
    }
    return next();
  } catch (err) {
    error(err);
    res.status(401);
    return next('unauthorized B');
  }
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
