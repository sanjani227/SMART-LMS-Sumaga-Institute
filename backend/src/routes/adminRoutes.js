import express from 'express';
import { getAllUsers, getIncomeStats } from '../controller/adminController.js';
import { authenticate, requireAdmin } from '../middleware/authentication.js';

const adminRoute = express.Router();

// Get all users (protected)
adminRoute.get("/users", authenticate, requireAdmin, getAllUsers);
// Get income stats (protected)
adminRoute.get("/income", authenticate, requireAdmin, getIncomeStats);

export default adminRoute;