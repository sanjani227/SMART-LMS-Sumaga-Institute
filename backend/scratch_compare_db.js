const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'sanjani2001',
            database: process.env.DB_NAME || 'sumaga_lms'
        });

        console.log('Connected to MySQL...');
        
        const [tables] = await connection.query('SHOW TABLES');
        const dbName = 'Tables_in_' + (process.env.DB_NAME || 'sumaga_lms');
        
        for (const row of tables) {
            const tableName = row[dbName];
            console.log(`\n--- Table: ${tableName} ---`);
            const [columns] = await connection.query(`DESCRIBE ${tableName}`);
            columns.forEach(col => {
                console.log(`${col.Field} | ${col.Type} | Null: ${col.Null} | Key: ${col.Key} | Default: ${col.Default} | Extra: ${col.Extra}`);
            });
        }
        
        await connection.end();
    } catch (error) {
        console.error('Error connecting to DB:', error);
    }
}

checkSchema();
