import { header } from 'express-validator';

export const authValidator = [
  header('authorization').isJWT().notEmpty().withMessage('Missing OAuthToken'),
];
