
import { generateToken } from "../middleware/token.js";

import bcryptjs from "bcryptjs";
import { User } from "../model/ormAuthModel.js";
import { myDataSource } from "../config/db.js";
import { where } from "sequelize";

const userRepo = myDataSource.getRepository("User");


export const RegisterUser = async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;
  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const exisitingUser = await userRepo.findOne({ where: { email } });
    if (exisitingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = userRepo.create({
      id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    });
    await userRepo.save(newUser);

    const token = generateToken(newUser._id, newUser.email, newUser.userType);
    console.log(token);

    res.status(200).json({
      message: "User registered successfully",
      token: token,
      data: {
        firstName,
        lastName,
        email,
        userType,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const exisitingUser = await userRepo.findOne({ where: { email } });
    if (!exisitingUser) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      exisitingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(
      exisitingUser.id,
      exisitingUser.email,
      exisitingUser.userType
    );

    console.log("Generated token:", token);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      message: "User logged in successfully",
      token: token,
      data: {
        firstName: exisitingUser.firstName,
        lastName: exisitingUser.lastName,
        id: exisitingUser.id,
        email: exisitingUser.email,
        userType: exisitingUser.userType,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const validateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Enter Email",
      });
    }

    const validEmail = await userRepo.findOne({ where: { email } });

    if (!validEmail) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    // Generate OTP
    const { generateOTP, logOTP } = await import('../utils/otpUtils.js');
    const otp = generateOTP();

    // Set expiry to 10 minutes from now
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    validEmail.otp = otp;
    validEmail.otpExpires = otpExpires;
    await userRepo.save(validEmail);

    // Log OTP to console (instead of email)
    logOTP(email, otp);

    return res.status(200).json({
      message: "OTP generated",
    });
  } catch (error) {
    console.error('Error in validateEmail:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        message: "No OTP found. Please request a new one.",
      });
    }

    // Check if OTP has expired
    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP is valid - clear it from database
    user.otp = null;
    user.otpExpires = null;
    await userRepo.save(user);

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const ChangePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!newPassword || !email) {
    return res.status(400).json({
      message: "Email and new password are required",
    });
  }

  try {
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;

    await userRepo.save(user);

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
