import { defineSecret } from 'firebase-functions/params';
import { SecretController } from './controllers/secrets.controller';
import { Express, Router } from 'express';

export const getSecrets = (env: string) => {
  const secrets = {
    common: [
      defineSecret('CLIENT_CERT'),
      defineSecret('CLIENT_KEY'),
      defineSecret('SERVER_CA'),
      defineSecret('AWS_ACCESS_KEY_ID'),
      defineSecret('AWS_SECRET_ACCESS_KEY'),
    ],
    production: [
      defineSecret('DB_PASS_PROD'),
      defineSecret('ADMIN_USER_PROD'),
      defineSecret('ADMIN_PASS_PROD'),
      defineSecret('DB_HOST_PROD'),
      defineSecret('LINK_PREVIEW_PROD'),
    ],
    development: [
      defineSecret('DB_PASS_DEV'),
      defineSecret('ADMIN_USER_DEV'),
      defineSecret('ADMIN_PASS_DEV'),
      defineSecret('DB_HOST_DEV'),
      defineSecret('LINK_PREVIEW_DEV'),
    ],
  };

  // Combine common and environment-specific secrets
  return [
    ...secrets.common,
    ...(env === 'production' ? secrets.production : secrets.development),
  ];
};

export const getLinkPreviewSecretSetup = (env: string) => {
  const secrets = {
    production: defineSecret('LINK_PREVIEW_PROD'),
    development: defineSecret('LINK_PREVIEW_DEV'),
  };
  // Combine common and environment-specific secrets
  return env === 'production' ? secrets.production : secrets.development;
};

export const setupSecretRoutes = (app: Router, env: string): void => {
  const secretManager = new SecretController(env);
  const secretRouter = Router();
  secretRouter.get('/link-previews', secretManager.getLinkPreviewSecret);
  secretRouter.get('/:name', secretManager.getSecret);
  app.use('/secrets', secretRouter);
};
