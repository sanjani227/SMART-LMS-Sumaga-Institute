import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/VIVO/Desktop/SDP/SMART-LMS-Sumaga-Institute/backend/.env" });

async function insertAll() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "127.0.0.1",
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "sanjani2001",
            database: process.env.DB_NAME || "sumaga_lms",
        });

        // Get all student IDs
        const [students] = await connection.execute('SELECT studentId FROM students');
        
        for (const student of students) {
            // Check if they have an invoice
            const [payments] = await connection.execute('SELECT * FROM payments WHERE studentId = ?', [student.studentId]);
            if (payments.length === 0) {
                await connection.execute(`
                    INSERT INTO payments (studentId, amount, paymentType, status, paymentMethod, createdAt, updatedAt) 
                    VALUES (?, '5500.00', 'tuition', 'pending', 'cash', NOW(), NOW())
                `, [student.studentId]);
                console.log(`Added mock invoice for student ${student.studentId}`);
            } else {
                console.log(`Student ${student.studentId} already has an invoice`);
            }
        }

        await connection.end();
    } catch (error) {
        console.error("Error:", error.message);
    }
}

insertAll();
