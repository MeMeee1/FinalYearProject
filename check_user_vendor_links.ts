import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' });

import pg from 'pg';
const { Pool } = pg;

async function checkUserVendorLinks() {
    try {
        console.log('\n=== USER-VENDOR RELATIONSHIP CHECK ===\n');

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        // Get all users with role='seller' and their vendor profiles
        const result = await pool.query(`
            SELECT 
                u.id as user_id,
                u.email,
                u.role,
                v.id as vendor_id,
                v."storeName",
                v.status as vendor_status,
                v."userId" as vendor_user_id
            FROM users u
            LEFT JOIN vendors v ON v."userId" = u.id
            WHERE u.role = 'seller'
            ORDER BY u.id
        `);

        console.log('SELLERS AND THEIR VENDOR PROFILES:\n');

        result.rows.forEach(row => {
            console.log(`User ID: ${row.user_id} | Email: ${row.email}`);
            if (row.vendor_id) {
                console.log(`  ✅ HAS VENDOR PROFILE`);
                console.log(`     Vendor ID: ${row.vendor_id}`);
                console.log(`     Store Name: ${row.storeName}`);
                console.log(`     Status: ${row.vendor_status}`);
            } else {
                console.log(`  ❌ NO VENDOR PROFILE - This user cannot access vendor dashboard!`);
            }
            console.log('');
        });

        // Also show all vendors
        const vendorsResult = await pool.query(`
            SELECT 
                v.id,
                v."userId",
                v."storeName",
                v.status,
                u.email
            FROM vendors v
            LEFT JOIN users u ON u.id = v."userId"
            ORDER BY v.id
        `);

        console.log('\n=== ALL VENDORS ===\n');
        vendorsResult.rows.forEach(vendor => {
            console.log(`Vendor ID: ${vendor.id} | Store: ${vendor.storeName} | Status: ${vendor.status}`);
            console.log(`  Linked to User ID: ${vendor.userId} (${vendor.email || 'NO USER'})`);
            console.log('');
        });

        await pool.end();
    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

checkUserVendorLinks();
