import {getAppCheck} from "firebase-admin/app-check";
import {Request, Response, NextFunction} from "express";
import {error, debug} from "firebase-functions/logger";
import {rateLimit} from "express-rate-limit";
import * as creds from "../credentials.json";
import {fbAdminApp} from ".";


export const appCheckGaurd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");
  const appCheckDebugToken = req.header("X-Firebase-AppCheck-Debug");
  const tokenToCheck = appCheckToken ? appCheckToken : appCheckDebugToken;
  debug({tokenToCheck, creds});
  if (!tokenToCheck) {
    res.status(401);
    return next("unauthorized A");
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await getAppCheck(fbAdminApp).verifyToken(tokenToCheck);
    debug({a: result.token});
    return next();
  } catch (err) {
    error(err);
    res.status(401);
    return next("unauthorized B");
  }
};

export const limiter = rateLimit({max: 100, windowMs: 15 * 60 * 1000});
