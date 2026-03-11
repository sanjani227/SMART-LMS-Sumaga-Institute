import express from 'express';
import { 
  getParentProfile, 
  getChildren, 
  getChildAttendance, 
  getChildPayments, 
  getChildProgress,
  syncParentUser,
  linkStudent
} from '../controller/parentController.js';
import { authenticate, requireParent } from '../middleware/authentication.js';

const parentRoute = express.Router();

// Sync parent data
parentRoute.get("/sync", syncParentUser);

// Get parent profile (protected)
parentRoute.get("/profile", authenticate, requireParent, getParentProfile);

// Get children list (protected)
parentRoute.get("/children", authenticate, requireParent, getChildren);

// Get child's attendance (protected)
parentRoute.get("/children/:studentId/attendance", authenticate, requireParent, getChildAttendance);

// Get child's payments (protected) 
parentRoute.get("/children/:studentId/payments", authenticate, requireParent, getChildPayments);

// Get child's progress/grades (protected)
parentRoute.get("/children/:studentId/progress", authenticate, requireParent, getChildProgress);

// Link a student to the parent (protected)
parentRoute.post("/link-student", authenticate, requireParent, linkStudent);

export default parentRoute;