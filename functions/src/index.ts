import cors = require('cors');
import express = require('express');
import { onRequest } from 'firebase-functions/v2/https';
// import { appCheckGaurd,  } from "./middleware";
import {
  clientCert,
  clientKey,
  secretNameDev,
  secretNameProd,
  secretRouter,
  serverCA,
} from './secrets';
import { limiter } from './middleware';
import { postRouter } from './db';

const app = express();
app.use(cors());
const jzPortfolioBackendExpressApp = express.Router();

app.use('/api/v3', limiter, jzPortfolioBackendExpressApp);
jzPortfolioBackendExpressApp.use(secretRouter);
jzPortfolioBackendExpressApp.use('/posts', postRouter);

const secretsApp = express();
const secretRouter = express.Router();

const limiter = rateLimit({ max: 100, windowMs: 15 * 60 * 1000 });

secretsApp.use(cors());

const getSecret = async (req: Request, res: Response) => {
  try {
    const apiKey = req.params.prod
      ? secretNameProd.value()
      : secretNameDev.value();
    debug({ k: apiKey });
    res.status(200).json({ k: apiKey });
  } catch (err) {
    error(err);
    res.status(400);
  }
};

const appCheckGaurd = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');
  const appCheckDebugToken = req.header('X-Firebase-AppCheck-Debug');
  const tokenToCheck = appCheckToken ? appCheckToken : appCheckDebugToken;
  debug({ tokenToCheck, creds, fbAdminApp });
  if (!tokenToCheck) {
    res.status(401);
    return next('unauthorized A');
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await fbAdminApp.appCheck().verifyToken(tokenToCheck);
    debug({ a: result.token });
    return next();
  } catch (err) {
    error(err);
    res.status(401);
    return next('unauthorized B');
  }
};

secretRouter.get('/secrets', getSecret);

secretsApp.use('/api/v2', limiter, appCheckGaurd, secretRouter);

export const secretService2ndGen = onRequest(
  { cors: true, secrets: [secretNameDev, secretNameProd] },
  secretsApp,
);
