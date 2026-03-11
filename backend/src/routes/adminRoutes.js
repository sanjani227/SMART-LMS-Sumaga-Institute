import express from 'express';
import { getAllUsers } from '../controller/adminController.js';
import { authenticate, requireAdmin } from '../middleware/authentication.js';

const adminRoute = express.Router();

// Get all users (protected)
adminRoute.get("/users", authenticate, requireAdmin, getAllUsers);

export default adminRoute;