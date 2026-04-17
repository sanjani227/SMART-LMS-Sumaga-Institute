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

        const [payments] = await connection.execute('SELECT * FROM payments WHERE studentId = 1');
        console.log("Payments for studentId=1:", JSON.stringify(payments, null, 2));

        const [payments2] = await connection.execute('SELECT * FROM payments WHERE studentId = 2');
        console.log("Payments for studentId=2:", JSON.stringify(payments2, null, 2));

        const [payments3] = await connection.execute('SELECT * FROM payments WHERE studentId = 3');
        console.log("Payments for studentId=3:", JSON.stringify(payments3, null, 2));

        const [payments4] = await connection.execute('SELECT * FROM payments WHERE studentId = 4');
        console.log("Payments for studentId=4:", JSON.stringify(payments4, null, 2));

        await connection.end();
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkDB();
