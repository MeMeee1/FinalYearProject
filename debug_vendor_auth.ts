import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' });

import { db } from './api/src/db/index.js';
import { vendorsTable } from './api/src/db/vendorsSchema.js';
import { usersTable } from './api/src/db/usersSchema.js';
import { eq } from 'drizzle-orm';

async function debugVendorAuth() {
    try {
        console.log('\n=== DEBUGGING VENDOR AUTHENTICATION ===\n');

        // Get all users
        const users = await db.select().from(usersTable);
        console.log('Total users in database:', users.length);
        console.log('Users:', users.map(u => ({
            id: u.id,
            email: u.email,
            role: u.role
        })));

        console.log('\n---\n');

        // Get all vendors
        const vendors = await db.select().from(vendorsTable);
        console.log('Total vendors in database:', vendors.length);
        console.log('Vendors:', vendors.map(v => ({
            id: v.id,
            userId: v.userId,
            storeName: v.storeName,
            status: v.status
        })));

        console.log('\n---\n');

        // Check for orphaned vendors (vendors without matching users)
        for (const vendor of vendors) {
            const user = users.find(u => u.id === vendor.userId);
            if (!user) {
                console.log(`⚠️ ORPHANED VENDOR: ${vendor.storeName} (id: ${vendor.id}) has userId ${vendor.userId} but no matching user exists!`);
            } else {
                console.log(`✓ Vendor "${vendor.storeName}" (status: ${vendor.status}) is linked to user "${user.email}" (id: ${user.id}, role: ${user.role})`);
            }
        }

        console.log('\n=== END DEBUG ===\n');

    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

debugVendorAuth();
