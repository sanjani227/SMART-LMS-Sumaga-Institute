/**
 * ========== AUTHENTICATION MIDDLEWARE ==========
 * File: backend/src/middleware/authentication.js
 * Purpose: JWT token verification and user authentication
 * 
 * @section Setup
 */
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// ========== LEGACY CODE (DEPRECATED) ==========
//   try {

//     let token = null
//     const authHeader = req.headers.authorization;

//     if(authHeader) {
//       token = authHeader.split(" ")[1]
//     }

//     if (!token) {
//       token = req.cookies?.__session

//     }

//     console.log(req.cookies)

//     console.log(token)

//     if (!token) {
//       return res.status(403).json({
//         message: "Not Authorized. Authentication needed",
//       });
//     }

//     // const token = authHeader.split(" ")[1];

    

//     const jwtSecret = process.env.JWT_SECRET;

//     const decode = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });

//     req.user = {
//       id: decode.id,
//       email: decode.email,
//       userType: decode.userType,
//     };

//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };

export const authenticate = (req, res, next) => {
  try {
    let token = null;

    // ✅ Try Authorization header FIRST
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      console.log("Token from header:", token); // Debug
    }

    // Try cookie if no header
    if (!token) {
      token = req.cookies?.authToken;
      console.log("Token from cookie:", token); // Debug
    }

    console.log("Final token:", token); // Debug

    if (!token) {
      return res.status(403).json({
        message: "Not Authorized. Authentication needed",
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
    console.log("Auth error:", error.message);
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const requireTeacher = (req, res, next) => {
  if (!req.user)
    return res.status({
      code: 403,
      message: "Unauthorized",
    });

  // console.log(req.user.userType)
  const role = String(req.user.userType || "").toLowerCase();
  if (role !== "teacher") {
    return res.status(403).json({ message: "Teacher access only" });
  }

  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user)
    return res.status(403).json({
      code: 403,
      message: "Unauthorized",
    });

  const role = String(req.user.userType || "").toLowerCase();
  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

export const requireStudent = (req, res, next) => {
  if (!req.user)
    return res.status(403).json({
      code: 403,
      message: "Unauthorized",
    });

  const role = String(req.user.userType || "").toLowerCase();
  if (role !== "student") {
    return res.status(403).json({ message: "Student access only" });
  }

  next();
};

export const requireParent = (req, res, next) => {
  if (!req.user)
    return res.status(403).json({
      code: 403,
      message: "Unauthorized",
    });

  const role = String(req.user.userType || "").toLowerCase();
  if (role !== "parent") {
    return res.status(403).json({ message: "Parent access only" });
  }

  next();
};

// Allow multiple roles
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(403).json({
        code: 403,
        message: "Unauthorized",
      });

    const role = String(req.user.userType || "").toLowerCase();
    if (!allowedRoles.map(r => r.toLowerCase()).includes(role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};
