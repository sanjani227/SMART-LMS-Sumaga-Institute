import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/VIVO/Desktop/SDP/SMART-LMS-Sumaga-Institute/backend/.env" });

async function insertMockInvoice() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "127.0.0.1",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "sanjani2001",
            database: process.env.DB_NAME || "sumaga_lms",
        });

        // Insert pending invoice for studentId 1
        await connection.execute(`
            INSERT INTO payments (studentId, amount, paymentType, status, paymentMethod, createdAt, updatedAt) 
            VALUES (1, '7500.00', 'tuition', 'pending', 'cash', NOW(), NOW())
        `);
        console.log("Mock pending invoice added for studentId 1");

        // Insert pending invoice for studentId 3
        await connection.execute(`
            INSERT INTO payments (studentId, amount, paymentType, status, paymentMethod, createdAt, updatedAt) 
            VALUES (3, '8900.00', 'tuition', 'pending', 'cash', NOW(), NOW())
        `);
        console.log("Mock pending invoice added for studentId 3");

        await connection.end();
    } catch (error) {
        console.error("Error:", error.message);
    }
}

insertMockInvoice();
