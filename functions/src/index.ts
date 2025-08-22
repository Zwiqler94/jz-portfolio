import { onRequest } from 'firebase-functions/v2/https';
import { getSecrets } from './secret-config';
import { createAppV3, createAppV4 } from './app';
import { cert, initializeApp } from 'firebase-admin/app';
import * as creds from '../credentials.json';


const env = process.env.NODE_ENV ?? 'development'; // Default to development
const secrets = getSecrets(env);

export const fbAdminApp = initializeApp({
  credential: cert({
    clientEmail: creds.client_email,
    privateKey: creds.private_key,
    projectId: creds.project_id,
  }),
});

// Deploy prod version (backward compatible with `/api/v3`)
export const jzPortfolioApp = onRequest(
  {
    maxInstances: 5,
    timeoutSeconds: 3600,
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets,
  },
  createAppV3(),
);

const finalSecrets = ["NEON_ADMIN_PASS",...secrets]
// Deploy dev version with `/api/v4`
export const jzPortfolioAppDev = onRequest(
  {
    maxInstances: 5,
    timeoutSeconds: 3600,
    serviceAccount: 'jzportfolioapp@jlz-portfolio.iam.gserviceaccount.com',
    cors: true,
    secrets: finalSecrets,
  },
  createAppV4(),
);

