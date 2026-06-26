import mysql from 'mysql2/promise';

declare global {
  var sseMysqlPool: mysql.Pool | undefined;
}

type DefaultQueryResult = mysql.ResultSetHeader & Array<Record<string, number>>;
type ExecuteParams = Parameters<mysql.Pool['execute']>[1];
type MysqlError = Error & { code?: string };

function shouldUseSsl(host: string): boolean {
  const explicit = process.env.DATABASE_SSL;
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;

  return !['localhost', '127.0.0.1', '::1'].includes(host);
}

export function getPool(): mysql.Pool {
  if (!globalThis.sseMysqlPool) {
    const host = process.env.DATABASE_HOST || '127.0.0.1';
    const ssl = shouldUseSsl(host)
      ? {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        }
      : undefined;
    const connectionLimit = parseInt(process.env.DATABASE_CONNECTION_LIMIT || '1', 10);

    globalThis.sseMysqlPool = mysql.createPool({
      host,
      port: parseInt(process.env.DATABASE_PORT || '3306', 10),
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'sse_db',
      ssl,
      waitForConnections: true,
      connectionLimit,
      maxIdle: Math.min(connectionLimit, 2),
      idleTimeout: 30000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return globalThis.sseMysqlPool;
}

function isConnectionLimitError(error: unknown): boolean {
  return (error as MysqlError)?.code === 'ER_CON_COUNT_ERROR';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function query<T = DefaultQueryResult>(
  sql: string,
  params?: unknown[] | Record<string, unknown>
): Promise<T> {
  const dbPool = getPool();
  const values = Array.isArray(params)
    ? params.map((value) => (value === undefined ? null : value))
    : params;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const [rows] = await dbPool.execute(sql, values as ExecuteParams);
      return rows as T;
    } catch (error) {
      if (!isConnectionLimitError(error) || attempt === 2) {
        throw error;
      }

      await sleep(250 * (attempt + 1));
    }
  }

  throw new Error('Database query failed.');
}
