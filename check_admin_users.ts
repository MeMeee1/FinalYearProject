import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' });

import pg from 'pg';
const { Pool } = pg;

async function checkAdminUsers() {
    try {
        console.log('\n=== CHECKING ADMIN USERS ===\n');

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        const result = await pool.query('SELECT id, email, role, status FROM users');
        const users = result.rows;

        console.log('All users in database:');
        users.forEach((user: any) => {
            console.log(`- Email: ${user.email}`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Status: ${user.status || 'N/A'}`);
            console.log('');
        });

        const admins = users.filter((u: any) => u.role === 'admin');
        console.log(`\nTotal admin users: ${admins.length}`);

        if (admins.length === 0) {
            console.log('⚠️ WARNING: No admin users found in the database!');
            console.log('You may need to manually update a user to be an admin.');
            console.log('\nTo make a user an admin, run this SQL in your database:');
            console.log(`UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';`);
        }

        await pool.end();
    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

checkAdminUsers();
