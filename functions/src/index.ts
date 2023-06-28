import cors = require("cors");
import express = require("express");
import { onRequest } from "firebase-functions/v2/https";
// import { appCheckGaurd,  } from "./middleware";
import { clientCert, clientKey, secretNameDev, secretNameProd, secretRouter, serverCA } from "./secrets";
import { limiter } from "./middleware";

const app = express();
app.use(cors())
const jzPortfolioBackendExpressApp = express.Router();

app.use('/api/v3', limiter, jzPortfolioBackendExpressApp);
jzPortfolioBackendExpressApp.use(secretRouter);

export const jzPortfolioApp = onRequest(
  {
    cors: true,
    secrets: [secretNameDev, secretNameProd, clientCert, clientKey, serverCA],
  },
  app
);
