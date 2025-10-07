import { defineSecret } from 'firebase-functions/params';
import { SecretController } from './controllers/secrets.controller';
import { Router } from 'express';

export const getSecrets = (env: string) => {
  const secrets = {
    production: [
      defineSecret('NEON_HOST_PROD'),
      defineSecret('NEON_PASS_PROD'),
      defineSecret('NEON_USER_PROD'),
      defineSecret('JLZ_APP_SERVER_CA'),
      defineSecret('LINK_PREVIEW_PROD'),
    ],
    development: [
      defineSecret('NEON_HOST_DEV'),
      defineSecret('NEON_PASS_DEV'),
      defineSecret('NEON_USER_DEV'),
      defineSecret('JLZ_APP_SERVER_CA'),
      defineSecret('LINK_PREVIEW_DEV'),
    ],
  };

  return [...(env === 'production' ? secrets.production : secrets.development)];
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
