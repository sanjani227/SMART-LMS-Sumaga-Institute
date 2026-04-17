import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/VIVO/Desktop/SDP/SMART-LMS-Sumaga-Institute/backend/.env" });

async function checkDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "127.0.0.1",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "sanjani2001",
            database: process.env.DB_NAME || "sumaga_lms",
        });

        const [rows] = await connection.execute('SELECT * FROM payments');
        console.log(JSON.stringify(rows.slice(0, 5), null, 2));

        await connection.end();
    } catch (error) {
        console.error("Error connecting to database:", error.message);
    }
}

checkDB();
