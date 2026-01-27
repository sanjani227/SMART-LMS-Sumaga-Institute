import express from 'express';
import authRouter from './src/routes/authRoutes.js';
// import { connectToDB } from './src/config/db.js';
import cors from 'cors'
import { myDataSource } from './src/config/db.js';



const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())

// connectToDB();
await myDataSource.initialize()
console.log('✅ Database connected successfully to:', process.env.DB_NAME || 'sumaga_lms');

// Register routes BEFORE starting the server
app.use('/api/v1/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 