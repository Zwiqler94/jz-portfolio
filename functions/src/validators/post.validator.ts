import { body } from 'express-validator';

export const postValidator = [
  body('location')
    .isIn(['Main', 'Puppy', 'Anime'])
    .withMessage('Unknown location')
    .notEmpty()
    .withMessage('missing value'),
  body('type')
    .isIn(['link', 'text', 'image'])
    .withMessage('Unknown type')
    .notEmpty()
    .withMessage('missing value'),
  body('status')
    .isIn(['pending'])
    .withMessage('Unknown status')
    .notEmpty()
    .withMessage('missing value'),
  body('title').notEmpty().withMessage('missing value'),
  body('content').notEmpty().withMessage('missing value'),
];
