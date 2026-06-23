import { onRequest } from 'firebase-functions/v2/https';
import { getSecrets } from './secret-config';
import { createAppV4 } from './app';
import { initializeApp } from 'firebase-admin/app';

const dbEnv = process.env.DB_ENV?.toLowerCase();
const env =
  dbEnv === 'prod' || dbEnv === 'production' ? 'production' : 'development';
const secrets = getSecrets(env);

export const fbAdminApp = initializeApp();

// Deploy prod version with `/api/v4`
export const jzPortfolioApp = onRequest(
  {
    maxInstances: 5,
    timeoutSeconds: 3600,
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets,
  },
  createAppV4(),
);

// Deploy dev version with `/api/v4`
export const jzPortfolioAppDev = onRequest(
  {
    maxInstances: 5,
    timeoutSeconds: 3600,
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets,
  },
  createAppV4(),
);
