
import { db } from './src/db/index';
import { vendorsTable } from './src/db/vendorsSchema';
import { usersTable } from './src/db/usersSchema';
import { eq } from 'drizzle-orm';

async function main() {
  const vendors = await db.select({
    id: vendorsTable.id,
    storeName: vendorsTable.storeName,
    status: vendorsTable.status,
    userId: vendorsTable.userId,
    email: usersTable.email
  })
    .from(vendorsTable)
    .leftJoin(usersTable, eq(vendorsTable.userId, usersTable.id));

  console.log('Vendors:', JSON.stringify(vendors, null, 2));
}

main().catch(console.error).then(() => process.exit(0));
