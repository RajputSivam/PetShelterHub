const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config({ path: path.join(__dirname, '.env') });

async function setupDatabase() {
    let connection;
    try {
        const databaseName = process.env.DB_NAME || 'PetShelterHub';
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: Number(process.env.DB_PORT) || 3306,
            multipleStatements: true
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
        await connection.query(`USE \`${databaseName}\``);
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await connection.query(schema);
        console.log('DATABASE READY');
    } catch (error) {
        console.error(`${error.code || 'UNKNOWN_ERROR'}: ${error.message}`);
        process.exitCode = 1;
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();