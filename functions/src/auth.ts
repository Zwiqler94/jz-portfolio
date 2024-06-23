import express, { Request, Response } from 'express';
import { getAppCheck } from 'firebase-admin/app-check';
import { debug, error } from 'firebase-functions/logger';
import basicAuth from 'express-basic-auth';

export const authRouter = express.Router();

const tokenGenerator = async (req: Request, res: Response) => {
  debug('meeep');
  try {
    const appToken = await getAppCheck().createToken(
      '1:518070660509:web:9d2511d1a027342457d374',
    );
    debug('meeep');
    res.status(200).json({ token: appToken.token });
  } catch (err) {
    error(err);
    res.status(500).json(err);
  }
};

const authorizer = (user: any, password: any) => {
  const userMatch = basicAuth.safeCompare(user, process.env.ADMIN_USER!);
  const passMatch = basicAuth.safeCompare(password, process.env.ADMIN_PASS!);
  return userMatch && passMatch;
};

authRouter.get('/token', basicAuth({ authorizer }), tokenGenerator);
