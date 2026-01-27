// import dotenv from "dotenv";
// import mongoose from "mongoose";
// dotenv.config();

// export const connectToDB = async(req,res) => {
//     try {
//         const connectDB = await mongoose.connect(process.env.DB_URL);
//         console.log("DB Connected")
//     } catch (error) {
//         console.log(error);
//     }
// }

import { DataSource } from "typeorm";
import { User } from "../model/ormAuthModel.js";
import { Parent } from "../model/parentModel.js";
import { Student } from "../model/studentModel.js";
import { Teacher } from "../model/teacherModel.js";
import { Subject, Class } from "../model/academicModel.js";
import { Attendance, Payment } from "../model/operationsModel.js";
import { Assessment, Result, LearningMaterial } from "../model/learningKeyModel.js";
import dotenv from "dotenv";

dotenv.config();

export const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "sanjani2001", // Fallback to existing password
  database: process.env.DB_NAME || "sumaga_lms",
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
  synchronize: true,
  logging: false
});

