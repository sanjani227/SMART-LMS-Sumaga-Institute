/**
 * ========== JWT TOKEN GENERATION & VERIFICATION ==========
 * File: backend/src/middleware/token.js
 * Purpose: Handle JWT token creation, validation, and decoding
 * 
 * @section Setup
 */
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// ========== TOKEN GENERATION FUNCTION ==========
/**
 * @function generateToken
 * @description Create JWT token for authenticated user
 * @param {number} userId - User ID
 * @param {string} email - User email
 * @param {string} userType - User role (student, teacher, admin, etc)
 */
export const generateToken = (userId, email, userType) => {
  const jwtSecret = process.env.JWT_SECRET;

  const payload = {
    id: userId,
    email: email,
    userType: userType,
  };

  console.log(payload)

  const token = jwt.sign(payload, jwtSecret, { algorithm: "HS256", expiresIn: "7d" });

  return token;
};

generateToken()

// ========== TOKEN VERIFICATION FUNCTION ==========
/**
 * @function verifyToken
 * @description Verify and decode JWT token
 * @param {string} token - JWT token to verify
 */
export const verifyToken = (token) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decode = jwt.verify(token, jwtSecret);
    return decode
  } catch (error) {
    console.log(error);
  }
};
