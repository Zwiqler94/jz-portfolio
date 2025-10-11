/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pool, PoolClient, QueryResult } from 'pg';
import { error, debug, info } from 'firebase-functions/logger';
export class DBController {
  private static username: string;
  private static password: string;
  private pool: Pool | undefined;
  private client: PoolClient | undefined;

  startUpDBService = async () => {
    try {
      debug('constructing');
      const dbEnv = process.env.DB_ENV?.toLowerCase() ?? 'local';
      const useLocalDb = ['local', 'localhost'].includes(dbEnv);

      this.pool = await this.connectDB(useLocalDb);
      this.client = await this.pool.connect();
      debug('done constructing');
      return this.client;
    } catch (err) {
      error(err);
      if (this.client) {
        this.client.release();
        this.client = undefined;
      }

      if (this.pool) {
        try {
          await this.pool.end();
        } catch (poolErr) {
          error('Failed to close connection pool after error', poolErr);
        } finally {
          this.pool = undefined;
        }
      }

      throw err instanceof Error
        ? err
        : new Error(JSON.stringify({ connectionError: err }));
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
    const runtimeEnv = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
    const keyFor = (base: string) => `${base}_${runtimeEnv}`;

    const resolveOptionalValue = (baseKey: string): string | undefined => {
      const envSpecificKey = keyFor(baseKey);
      return (
        process.env[envSpecificKey] ??
        process.env[baseKey] ??
        process.env[baseKey.toLowerCase()]
      );
    };

    const resolveFirstValue = (...baseKeys: string[]): string | undefined => {
      for (const key of baseKeys) {
        const value = resolveOptionalValue(key);
        if (value) {
          return value;
        }
      }
      return undefined;
    };

    const requireValue = (...baseKeys: string[]): string => {
      const value = resolveFirstValue(...baseKeys);
      if (!value) {
        const attempted = baseKeys.map((key) => keyFor(key)).join(', ');
        throw new Error(
          `Missing environment variable for one of: ${attempted}`,
        );
      }
      return value;
    };

    const toSslConfig = (value?: string) => {
      if (!value) return undefined;
      const normalized = value.includes('BEGIN CERTIFICATE')
        ? value
        : Buffer.from(value, 'base64').toString('utf8');
      return { ca: normalized } as const;
    };

    if (!useLocal) {
      const dbUser = resolveFirstValue('NEON_USER');

      if (!dbUser) {
        throw new Error('Missing database user environment variable');
      }

      const application_name = `jlz_portfolio_${process.env.DB_ENV ?? 'remote'}_${dbUser}`;

      DBController.password = requireValue('NEON_PASS');
      DBController.username = dbUser;

      // const caCert = Buffer.from(await getSecretValue('caSSLCert'));

      const connectionString = `postgresql://${DBController.username}:${DBController.password}@${process.env.DB_HOST}.c-2.us-east-2.aws.neon.tech/jz-local?sslmode=require&channel_binding=require`; //`postgres://${DBController.username}:${DBController.password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require&channel_binding=require`;
      this.pool = new Pool({
        connectionString,
        application_name,
        host: requireValue('NEON_HOST'),
        user: DBController.username,
        password: DBController.password,
        database: process.env.DB_NAME,
        ssl: true,
      })
        .on('connect', () => {
          debug('connected to remote DB');
        })
        .on('release', () => {
          debug('bye bye');
        })
        .on('error', (poolErr: Error) => {
          error('Unexpected error on idle client', poolErr);
        });
    } else {
      const dbUser = requireValue('LOCAL_DB_USER');
      const application_name = `jlz_portfolio_${process.env.DB_ENV ?? 'local'}_${dbUser}`;

      this.pool = new Pool({
        application_name,
        host: requireValue('LOCAL_DB_HOST'),
        user: dbUser,
        password: requireValue('LOCAL_DB_PASS'),
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT ?? 5433),
        ssl: process.env.DB_SSL === 'true' ? true : false,
      })
        .on('connect', () => {
          debug('connected to local DB');
        })
        .on('release', () => {
          debug('bye bye');
        })
        .on('error', (poolErr: Error) => {
          error('Unexpected error on idle client', poolErr);
        });
    }
    return this.pool;
  };
}
