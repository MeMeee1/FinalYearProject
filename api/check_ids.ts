
import 'dotenv/config';
import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
    const users = await db.execute(sql`SELECT id FROM users LIMIT 5`);
    const products = await db.execute(sql`SELECT id FROM products LIMIT 5`);

    console.log('Users:', users.rows);
    console.log('Products:', products.rows);
    process.exit(0);
}

main().catch(console.error);
