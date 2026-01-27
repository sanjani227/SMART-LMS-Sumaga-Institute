import { DataSource } from "typeorm";
import { User } from "./src/model/ormAuthModel.js";
import { Parent } from "./src/model/parentModel.js";
import { Student } from "./src/model/studentModel.js";
import { Teacher } from "./src/model/teacherModel.js";
import { Subject, Class } from "./src/model/academicModel.js";
import { Attendance, Payment } from "./src/model/operationsModel.js";
import { Assessment, Result, LearningMaterial } from "./src/model/learningKeyModel.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the backend directory (where this script resides)
dotenv.config({ path: join(__dirname, '.env') });

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "", // Set your DB password in .env
    database: process.env.DB_NAME || "sumaga_lms",
    synchronize: true, // CAUTION: This creates/updates tables automatically. Use false in production.
    logging: true,
    entities: [
        User,
        Parent,
        Student,
        Teacher,
        Subject,
        Class,
        Attendance,
        Payment,
        Assessment,
        Result,
        LearningMaterial
    ],
    migrations: [],
    subscribers: [],
});

import bcrypt from "bcrypt";
import { UserType } from "./src/utils/enum.js";

const initializeDatabase = async () => {
    try {
        // First, create the database if it doesn't exist
        const mysql = await import('mysql2/promise');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'sumaga_lms'}`);
        console.log(`Database '${process.env.DB_NAME || 'sumaga_lms'}' ensured.`);
        await connection.end();

        // Now initialize the DataSource with the database
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        console.log("Database schema synchronized successfully.");

        // Seeding Owner User
        const userRepository = AppDataSource.getRepository(User);
        const ownerEmail = "Sumaga@gmail.com";
        const existingOwner = await userRepository.findOneBy({ email: ownerEmail });

        if (!existingOwner) {
            console.log("Seeding Owner/Admin user...");
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash("sumaga123", saltRounds);

            const ownerUser = userRepository.create({
                firstName: "Sumudu",
                lastName: "Asanka",
                email: ownerEmail,
                password: hashedPassword,
                userType: UserType.OWNER // or UserType.ADMIN based on your logic preference, using OWNER as per prompt
            });

            await userRepository.save(ownerUser);
            console.log("Owner user created successfully.");
        } else {
            console.log("Owner user already exists.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    }
};

initializeDatabase();
