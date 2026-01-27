import express from "express";
import { LoginUser, RegisterUser, validateEmail, ChangePassword } from "../controller/authController.js";
import { authenticate } from "../middleware/authentication.js";

const authRouter = express.Router();

authRouter.route("/register").post(RegisterUser);
authRouter.route("/login").post(LoginUser);
authRouter.route("/validateEmail").post(validateEmail);
authRouter.route("/changePassword").post(ChangePassword);

export default authRouter;
