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
import announcementRoute from './src/routes/announcementRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// connectToDB();

await myDataSource.initialize();
console.log('✅ Database connected successfully to:', process.env.DB_NAME || 'sumaga_lms');

// --- SYNC DB AT STARTUP ---
try {
  // Student sync
  const { syncStudentUser } = await import('./src/controller/studentController.js');
  await syncStudentUser(
    { user: { id: null } }, // dummy req
    { json: () => {}, status: () => ({ json: () => {} }) } // dummy res
  );
  // Teacher sync
  const { autoUpdateTeacherFromAllUsers } = await import('./src/controller/teacherController.js');
  await autoUpdateTeacherFromAllUsers(
    { user: { id: null } },
    { json: () => {}, status: () => ({ json: () => {} }) }
  );
  // Parent sync
  const { syncParentUser } = await import('./src/controller/parentController.js');
  await syncParentUser(
    { user: { id: null } },
    { json: () => {}, status: () => ({ json: () => {} }) }
  );
  console.log('✅ Database sync complete');
} catch (err) {
  console.error('❌ Database sync failed:', err);
}


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
app.use('/api/v1/announcements', announcementRoute)


app.use("/healthCheck", (req, res) => {
  res.json({
    code: 200,
    message: "All good"
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 