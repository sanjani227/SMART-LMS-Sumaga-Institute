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

export const myDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "sanjani2001",
  database: "lms",
  entities: [User],
  synchronize: true,
  logging: false
});

