
import dotenv from 'dotenv';
dotenv.config();

import { db } from './src/db/index.js';
import { vendorsTable } from './src/db/vendorsSchema.js';
import { usersTable } from './src/db/usersSchema.js';
import { eq } from 'drizzle-orm';

async function checkVendor() {
  try {
    const vendors = await db.select().from(vendorsTable);
    console.log('All vendors:', JSON.stringify(vendors, null, 2));
    
    // Check users too to see if we can match
    const users = await db.select().from(usersTable);
    console.log('All users:', JSON.stringify(users, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}

checkVendor();
