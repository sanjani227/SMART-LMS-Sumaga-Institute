import express from "express";
import { LoginUser, RegisterUser, validateEmail, ChangePassword, verifyOTP } from "../controller/authController.js";
import { authenticate } from "../middleware/authentication.js";

const authRouter = express.Router();

authRouter.route("/register").post(RegisterUser);
authRouter.route("/login").post(LoginUser);
authRouter.route("/validateEmail").post(validateEmail);
authRouter.route("/verifyOtp").post(verifyOTP);
authRouter.route("/changePassword").post(ChangePassword);

export default authRouter;
