import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var __kclPool: Pool | undefined;
}

function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error("Missing DATABASE_URL. Please configure Neon connection string in environment variables.");
  }
  return value;
}

function createPool(): Pool {
  const connectionString = getDatabaseUrl();

  return new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
}

export function getPool(): Pool {
  if (!global.__kclPool) {
    global.__kclPool = createPool();
  }

  return global.__kclPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}
