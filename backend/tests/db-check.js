const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function checkDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: Number(process.env.DB_PORT) || 3306,
            database: process.env.DB_NAME || 'PetShelterHub'
        });
        await connection.query('SELECT 1');
        console.log('CONNECTED');
    } catch (error) {
        console.error(`${error.code || 'UNKNOWN_ERROR'}: ${error.message}`);
        process.exitCode = 1;
    } finally {
        if (connection) await connection.end();
    }
}

checkDatabase();