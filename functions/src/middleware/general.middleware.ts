import { getAppCheck } from 'firebase-admin/app-check';

import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  Express,
} from 'express';
import { debug, error } from 'firebase-functions/logger';
import { rateLimit } from 'express-rate-limit';
import { validationResult } from 'express-validator';
import basicAuth from 'express-basic-auth';
import { getAuth } from 'firebase-admin/auth';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import { serve, setup } from 'swagger-ui-express';
import swaggerDoc from '../../JAZWICKLER-JLZ-5.1.7-swagger.json';

export const basicAuthorizer = (user: any, password: any) => {
  const userMatch = basicAuth.safeCompare(user, process.env.ADMIN_USER!);
  const passMatch = basicAuth.safeCompare(password, process.env.ADMIN_PASS!);
  return userMatch && passMatch;
};

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearerToken = req.headers.authorization?.trim().split(' ');

    if (bearerToken) {
      debug(bearerToken[1]);
      const decodedToken = await getAuth().verifyIdToken(bearerToken[1]);
      debug(`${decodedToken.uid}'s token verified!`);
      next();
    } else {
      return next(new Error('Missing Header'));
    }
  } catch (err) {
    res.status(401);
    return next(err);
  }
};

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
    return next();
  } catch (err: any) {
    // error(err);
    res.status(401);
    return next(`Unauthorized Code: Error ${err.message}`);
  }
  // next();
};

const allowList = ['127.0.0.1', '0.0.0.0'];

export const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  validate: { ip: false },
  legacyHeaders: false,
  standardHeaders: 'draft-7',
  // skip: (req, res) => allowList.includes(req.ip as string),
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
    res.status(400).json({ errors: result.array() });
  }
};

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  error(err.stack);
  res.status(res.statusCode !== 200 ? res.statusCode : 500).json({
    name: err.name,
    code: res.statusCode,
    description: err.message ? err.message : err,
    stack: err.stack,
  });
};

const corsOpts: CorsOptions = {
  origin: ['http://localhost'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  exposedHeaders: ['X-Ratelimit-Limit', 'Set-Cookie'],
  allowedHeaders: [
    'Set-Cookie',
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  credentials: true,
};

export const setupMiddleware = (app: Express): void => {
  // CORS
  app.use(cors(corsOpts));

  // Security headers
  app.use(helmet());

  // Compression
  app.use(compression());

  // Rate Limiting
  // app.use(limiter);

  // Trust Proxy
  app.set('trust proxy', 1);

  // Disable 'X-Powered-By' header
  app.set('X-Powered-By', false);

  // Swagger Documentation
  app.use('/api-docs', serve, setup(swaggerDoc)); // Mount Swagger UI

  // App Check Guard Middleware
  app.use(appCheckGaurd);

  // Error Handler Middleware
  app.use(errorHandler);
};
