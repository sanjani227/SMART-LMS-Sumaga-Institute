import express from "express";
import { LoginUser, RegisterUser, validateEmail, ChangePassword, verifyOTP, getMe, updateProfile, updatePreferences, updatePassword } from "../controller/authController.js";
import { authenticate } from "../middleware/authentication.js";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controller/adminController.js";

const authRouter = express.Router();

authRouter.route("/register").post(RegisterUser);
authRouter.route("/login"). post(LoginUser);
authRouter.route("/validateEmail").post(validateEmail);
authRouter.route("/verifyOtp").post(verifyOTP);
authRouter.route("/changePassword").post(ChangePassword);

// Settings routes
authRouter.get("/me", authenticate, getMe);
authRouter.put("/updateProfile", authenticate, updateProfile);
authRouter.put("/updatePreferences", authenticate, updatePreferences);
authRouter.put("/updatePassword", authenticate, updatePassword);

authRouter.get("/allUsers", getAllUsers )
authRouter.get("/users/:id", getUserById);
authRouter.put("/users/:id", updateUser);
authRouter.delete("/users/:id", deleteUser);

export default authRouter;
