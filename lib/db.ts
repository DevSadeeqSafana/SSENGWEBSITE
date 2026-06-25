import mysql from 'mysql2/promise';

let pool: mysql.Pool;

type DefaultQueryResult = mysql.ResultSetHeader & Array<Record<string, number>>;
type ExecuteParams = Parameters<mysql.Pool['execute']>[1];

function shouldUseSsl(host: string): boolean {
  const explicit = process.env.DATABASE_SSL;
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;

  return !['localhost', '127.0.0.1', '::1'].includes(host);
}

export function getPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DATABASE_HOST || '127.0.0.1';
    const ssl = shouldUseSsl(host)
      ? {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        }
      : undefined;

    pool = mysql.createPool({
      host,
      port: parseInt(process.env.DATABASE_PORT || '3306', 10),
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'sse_db',
      ssl,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

export async function query<T = DefaultQueryResult>(
  sql: string,
  params?: unknown[] | Record<string, unknown>
): Promise<T> {
  const dbPool = getPool();
  const values = Array.isArray(params)
    ? params.map((value) => (value === undefined ? null : value))
    : params;
  const [rows] = await dbPool.execute(sql, values as ExecuteParams);
  return rows as T;
}
