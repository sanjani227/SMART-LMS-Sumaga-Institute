import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const generateToken = (userId, email, userType) => {
  const jwtSecret = process.env.JWT_SECRET;

  const payload = {
    id: userId,
    email: email,
    userType: userType,
  };

  console.log(payload)

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });

  return token;
};

generateToken()

export const verifyToken = (token) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decode = jwt.verify(token, jwtSecret);
    return decode
  } catch (error) {
    console.log(error);
  }
};
