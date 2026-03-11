import express from 'express';
import authRouter from './src/routes/authRoutes.js';
import subjectRouter from './src/routes/subjectRoutes.js';
import cors from 'cors'
import { myDataSource } from './src/config/db.js';
import teacherRoute from './src/routes/teacherRoutes.js';
import classRoute from './src/routes/classRoutes.js';
import cookieParser from 'cookie-parser';
import studentRoute from './src/routes/studentRoutes.js';
import parentRoute from './src/routes/parentRoutes.js';
import adminRoute from './src/routes/adminRoutes.js';



const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// connectToDB();
await myDataSource.initialize()
console.log('✅ Database connected successfully to:', process.env.DB_NAME || 'sumaga_lms');


app.use(
  cors({
    origin: "http://localhost:3001",  // ✅ Your frontend URL
    credentials: true,                 // ✅ Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

// Register routes BEFORE starting the server
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/subjects', subjectRouter)
app.use('/api/v1/teachers', teacherRoute)
app.use('/api/v1/classes', classRoute)
app.use('/api/v1/students', studentRoute)
app.use('/api/v1/parents', parentRoute)
app.use('/api/v1/admin', adminRoute)


app.use("/healthCheck", (req, res) => {
  res.json({
    code: 200,
    message: "All good"
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 