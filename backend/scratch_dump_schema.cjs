const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function dumpSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'sanjani2001',
            database: process.env.DB_NAME || 'sumaga_lms'
        });

        console.log('Connected to MySQL... building schema.');
        
        const [tables] = await connection.query('SHOW TABLES');
        const dbName = 'Tables_in_' + (process.env.DB_NAME || 'sumaga_lms');
        
        let schemaSQL = `-- =======================================================================================\n`;
        schemaSQL += `-- Database Schema for sumaga_lms\n`;
        schemaSQL += `-- Auto-generated from current database state\n`;
        schemaSQL += `-- =======================================================================================\n\n`;
        schemaSQL += `DROP DATABASE IF EXISTS sumaga_lms;\n`;
        schemaSQL += `CREATE DATABASE sumaga_lms;\n`;
        schemaSQL += `USE sumaga_lms;\n\n`;
        schemaSQL += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;
        
        for (const row of tables) {
            const tableName = row[dbName];
            const [createTableResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
            
            schemaSQL += `-- ---------------------------------------------------------------------------------------\n`;
            schemaSQL += `-- Table: ${tableName}\n`;
            schemaSQL += `-- ---------------------------------------------------------------------------------------\n`;
            schemaSQL += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
            schemaSQL += createTableResult[0]['Create Table'] + `;\n\n`;
        }

        schemaSQL += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;
        
        // Let's add some basic seed data if we can, or leave it.
        // We'll just output the file to the root database_schema.sql
        
        const targetPath = path.join(__dirname, '..', 'database_schema.sql');
        fs.writeFileSync(targetPath, schemaSQL, 'utf8');
        
        console.log('Successfully updated database_schema.sql');
        await connection.end();
    } catch (error) {
        console.error('Error connecting to DB:', error);
    }
}

dumpSchema();
