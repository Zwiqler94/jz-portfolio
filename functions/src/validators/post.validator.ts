import { body } from 'express-validator';

export const postValidator = [
  body('location')
    .isString()
    .withMessage('Unknown location')
    .trim()
    .notEmpty()
    .withMessage('missing value'),
  body('type')
    .isIn(['link', 'text', 'TextPost', 'LinkPost'])
    .withMessage('Unknown type')
    .notEmpty()
    .withMessage('missing value'),
  body('status')
    .isIn(['pending', 'posted', 'editing', 'draft', 'deleted', 'archived'])
    .withMessage('Unknown status')
    .notEmpty()
    .withMessage('missing value'),
  body('title').notEmpty().withMessage('missing value'),
  body('content').notEmpty().withMessage('missing value'),
];
