import { Pool, QueryResult, QueryResultRow } from 'pg';
import { debug, error, info } from 'firebase-functions/logger';

type RuntimeEnv = 'DEV' | 'PROD';
type DbEnv = 'local' | 'localhost' | 'dev' | 'development' | 'prod' | 'production';

export class DBController {
  private pool: Pool | undefined;

  startUpDBService = async (): Promise<Pool> => this.getPool();

  querySingle = async <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> => this.query<T>(text, params);

  query = async <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> => {
    const start = Date.now();
    try {
      const pool = this.getPool();
      info('executing query...', { text, paramCount: params.length });
      const res = await pool.query<T>(text, params);
      info('query executed', {
        text,
        duration: Date.now() - start,
        rows: res.rowCount,
      });
      return res;
    } catch (err) {
      error(err);
      throw err instanceof Error
        ? err
        : new Error(JSON.stringify({ queryError: err }));
    }
  };

  closeDB = async (): Promise<void> => {
    if (!this.pool) {
      return;
    }

    await this.pool.end();
    this.pool = undefined;
  };

  private getPool(): Pool {
    if (!this.pool) {
      const dbEnv = this.resolveDbEnv();
      this.pool = this.connectDB(dbEnv === 'local' || dbEnv === 'localhost');
    }

    return this.pool;
  }

  private connectDB(useLocal: boolean): Pool {
    const runtimeEnv = this.resolveRuntimeEnv();
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
        const attempted = baseKeys
          .flatMap((key) => [keyFor(key), key])
          .join(', ');
        throw new Error(`Missing environment variable for one of: ${attempted}`);
      }
      return value;
    };

    if (useLocal) {
      const dbUser = requireValue('LOCAL_DB_USER');
      const pool = new Pool({
        application_name: `jlz_portfolio_${process.env.DB_ENV ?? 'local'}_${dbUser}`,
        host: requireValue('LOCAL_DB_HOST'),
        user: dbUser,
        password: requireValue('LOCAL_DB_PASS'),
        database: requireValue('DB_NAME'),
        port: Number(resolveFirstValue('DB_PORT') ?? 5433),
        ssl: process.env.DB_SSL === 'true',
      });

      return this.attachPoolLogging(pool, 'local');
    }

    const dbUser = requireValue('NEON_USER');
    const password = requireValue('NEON_PASS');
    const host = requireValue('NEON_HOST');
    const database = requireValue('DB_NAME');
    const connectionString =
      `postgresql://${encodeURIComponent(dbUser)}:` +
      `${encodeURIComponent(password)}@${host}/${database}` +
      '?sslmode=require&channel_binding=require';

    const pool = new Pool({
      application_name: `jlz_portfolio_${process.env.DB_ENV ?? 'remote'}_${dbUser}`,
      connectionString,
    });

    return this.attachPoolLogging(pool, 'remote');
  }

  private attachPoolLogging(pool: Pool, label: string): Pool {
    return pool
      .on('connect', () => {
        debug(`connected to ${label} DB`);
      })
      .on('release', () => {
        debug(`released ${label} DB client`);
      })
      .on('error', (poolErr: Error) => {
        error('Unexpected error on idle client', poolErr);
      });
  }

  private resolveDbEnv(): DbEnv {
    const dbEnv = (process.env.DB_ENV ?? 'local').toLowerCase();
    if (
      [
        'local',
        'localhost',
        'dev',
        'development',
        'prod',
        'production',
      ].includes(dbEnv)
    ) {
      return dbEnv as DbEnv;
    }

    throw new Error(
      `Unsupported DB_ENV "${dbEnv}". Expected local, dev, or prod.`,
    );
  }

  private resolveRuntimeEnv(): RuntimeEnv {
    const dbEnv = this.resolveDbEnv();
    return dbEnv === 'prod' || dbEnv === 'production' ? 'PROD' : 'DEV';
  }
}
