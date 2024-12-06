/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable no-extra-boolean-cast */
import { Pool, PoolClient, QueryResult } from 'pg';
import { error, debug, info } from 'firebase-functions/logger';
import { getSecretValue } from '../utils';

export class DBController {
  private static username: string;
  private static password: string;
  private pool: Pool | undefined;
  private client: PoolClient | undefined;

  startUpDBService = async () => {
    try {
      debug('constructing');
      if (process.env.DB_ENV && process.env.DB_ENV === 'AWS') {
        this.pool = await this.connectDB(false);
        this.client = await this.pool.connect();
      } else {
        this.pool = await this.connectDB(true);
        this.client = await this.pool.connect();
      }
      debug('done constructing');
      return this.client;
    } catch (err) {
      error(err);
      this.client?.release();
      this.pool?.on('error', (err, client) => {
        error('Unexpected error on idle client', err);
        process.exit(-1);
      });
      throw new Error(JSON.stringify({ connectionError: err }));
    }
  };

  querySingle = async (
    text: string,
    params?: any,
  ): Promise<QueryResult<any>> => {
    try {
      const start = Date.now();
      if (this.client) {
        info('executing query...', { text, params });
        const res = await this.client.query(text, params);
        const duration = Date.now() - start;
        info('query executed', { text, duration, rows: res.rowCount });
        this.client.release();
        return (
          res || {
            rows: [],
            command: '',
            rowCount: null,
            oid: 0,
            fields: [],
          }
        );
      } else {
        throw new Error('no pool established');
      }
    } catch (err) {
      error(err);
      throw new Error(JSON.stringify(err));
    }
  };

  query = async (text: string, params?: any): Promise<QueryResult<any>> => {
    try {
      const start = Date.now();
      if (this.client) {
        info('executing query...', { text, params });
        const res = await this.client.query(text, params);
        const duration = Date.now() - start;
        info('query executed', { text, duration, rows: res.rowCount });
        return (
          res || {
            rows: [],
            command: '',
            rowCount: null,
            oid: 0,
            fields: [],
          }
        );
      } else {
        throw new Error('no pool established');
      }
    } catch (err) {
      error(err);
      throw new Error(JSON.stringify(err));
    }
  };

  closeDB = async () => {
    try {
      if (this.pool) await this.pool.end();
      else throw new Error('no pool established');
    } catch (err) {
      error(err);
      throw new Error(JSON.stringify(err));
    }
  };

  connectDB = async (useLocal: boolean) => {
    const application_name = `jlz_portfolio_${process.env.DB_ENV}_${process.env.DB_USER}`;

    if (!useLocal) {
      const { username, password } = JSON.parse(
        await getSecretValue('rds!db-84dfcf5a-5942-4ee0-9122-9ed073a5c0d5'),
      );

      DBController.password = password;
      DBController.username = username;

      const caCert = Buffer.from(await getSecretValue('caSSLCert'));

      this.pool = new Pool({
        application_name,
        host: process.env.DB_HOST,
        user: DBController.username,
        password: DBController.password,
        database: process.env.DB_NAME,
        ssl: {
          ca: caCert,
        },
      })
        .on('connect', () => {
          debug('connected to prod DB');
        })
        .on('release', () => {
          debug('bye bye');
        });
    } else {
      this.pool = new Pool({
        application_name,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: 5433,
        ssl: false,
      })
        .on('connect', () => {
          debug('connected to local DB');
        })
        .on('release', () => {
          debug('bye bye');
        });
    }
    return this.pool;
  };
}
