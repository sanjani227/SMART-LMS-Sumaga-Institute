
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
      exisitingUser._id,
      exisitingUser.email,
      exisitingUser.userType
    );

    res.status(200).json({
      message: "User logged in successfully",
      token: token,
      data: {
        firstName: exisitingUser.firstName,
        lastName: exisitingUser.lastName,
        id: exisitingUser._id,
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

    return res.status(200).json({
      message: "Email found",
    });
  } catch (error) {
    console.error('Error in validateEmail:', error);
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
