import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({
        message: "Not Authorized. Authentication needed",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not Authorized.Token Expired",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    const decode = jwt.verify(token, jwtSecret);

    req.user = {
      id: decode.id,
      email: decode.email,
      userType: decode.userType,
    };

    next();
  } catch (error) {
    console.log(error);
  }
};
