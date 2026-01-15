import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' });

import pg from 'pg';
const { Pool } = pg;

async function fixOrphanedSellers() {
    try {
        console.log('\n=== FIXING ORPHANED SELLERS ===\n');

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        // Find all users with role='seller' who don't have a vendor profile
        const result = await pool.query(`
            SELECT u.id, u.email, u.role 
            FROM users u
            LEFT JOIN vendors v ON v."userId" = u.id
            WHERE u.role = 'seller' AND v.id IS NULL
        `);

        const orphanedSellers = result.rows;

        console.log(`Found ${orphanedSellers.length} sellers without vendor profiles:\n`);

        orphanedSellers.forEach(user => {
            console.log(`- User ID: ${user.id}, Email: ${user.email}`);
        });

        if (orphanedSellers.length > 0) {
            console.log('\n⚠️ RECOMMENDATION:');
            console.log('These users have role="seller" but no vendor profile.');
            console.log('You should either:');
            console.log('1. Create vendor profiles for them via the vendor signup flow');
            console.log('2. Change their role to "user" if they should not be vendors');
            console.log('\nTo change role to user, run:');
            orphanedSellers.forEach(user => {
                console.log(`UPDATE users SET role = 'user' WHERE id = ${user.id}; -- ${user.email}`);
            });
        }

        await pool.end();
    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

fixOrphanedSellers();
