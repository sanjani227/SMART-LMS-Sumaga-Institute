import express from "express";
import { LoginUser, RegisterUser, validateEmail, ChangePassword, verifyOTP, getMe, updateProfile, updatePreferences, updatePassword } from "../controller/authController.js";
import { authenticate } from "../middleware/authentication.js";
import { getAllUsers } from "../controller/adminController.js";

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

export default authRouter;
