
import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' });

import { db } from './api/src/db/index.js';
import { vendorsTable } from './api/src/db/vendorsSchema.js';
import { usersTable } from './api/src/db/usersSchema.js';
import { eq } from 'drizzle-orm';

async function checkVendor() {
    try {
        const vendors = await db.select().from(vendorsTable);
        console.log('All vendors:', vendors);

        // You might want to filter by a specific user if you know their email or ID
        // const users = await db.select().from(usersTable);
        // console.log('All users:', users);

    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

checkVendor();
