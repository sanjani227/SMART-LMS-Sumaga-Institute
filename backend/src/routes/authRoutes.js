/**
 * ========== AUTHENTICATION ROUTES ==========
 * File: backend/src/routes/authRoutes.js
 * Purpose: Define authentication endpoints (register, login, OTP, password)
 * 
 * @section Imports
 */
import express from "express";
import { LoginUser, RegisterUser, validateEmail, ChangePassword, verifyOTP, getMe, updateProfile, updatePreferences, updatePassword } from "../controller/authController.js";
import { authenticate } from "../middleware/authentication.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controller/adminController.js";

const authRouter = express.Router();

// ========== PUBLIC AUTH ENDPOINTS ==========
authRouter.route("/register").post(RegisterUser);
authRouter.route("/login"). post(LoginUser);
authRouter.route("/validateEmail").post(validateEmail);
authRouter.route("/verifyOtp").post(verifyOTP);
authRouter.route("/changePassword").post(ChangePassword);

// ========== PROTECTED USER SETTINGS ENDPOINTS ==========
authRouter.get("/me", authenticate, getMe);
authRouter.put("/updateProfile", authenticate, updateProfile);
authRouter.put("/updatePreferences", authenticate, updatePreferences);
authRouter.put("/updatePassword", authenticate, updatePassword);

// ========== ADMIN USER MANAGEMENT ENDPOINTS ==========
authRouter.get("/allUsers", getAllUsers )
authRouter.get("/users/:id", getUserById);
authRouter.put("/users/:id", updateUser);
authRouter.delete("/users/:id", deleteUser);

export default authRouter;
