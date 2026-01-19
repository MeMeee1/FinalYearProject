import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL!;
const isRemote = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');

const pool = new pg.Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  max: 10,
});

export const db = drizzle(pool);
