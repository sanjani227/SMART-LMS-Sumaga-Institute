import express from 'express';
import { 
  getParentProfile, 
  getChildren, 
  getParentSettings,
  linkChildToParent,
  getChildAttendance, 
  getChildPayments, 
  getChildProgress,
  syncParentUser 
} from '../controller/parentController.js';
import { authenticate, requireParent } from '../middleware/authentication.js';

const parentRoute = express.Router();

// Sync parent data
parentRoute.get("/sync", syncParentUser);

// Get parent profile (protected)
parentRoute.get("/profile", authenticate, requireParent, getParentProfile);

// Get children list (protected)
parentRoute.get("/children", authenticate, requireParent, getChildren);

// Parent settings (protected)
parentRoute.get("/settings", authenticate, requireParent, getParentSettings);

// Link child to parent (protected)
parentRoute.post("/children/link", authenticate, requireParent, linkChildToParent);

// Get child's attendance (protected)
parentRoute.get("/children/:studentId/attendance", authenticate, requireParent, getChildAttendance);

// Get child's payments (protected) 
parentRoute.get("/children/:studentId/payments", authenticate, requireParent, getChildPayments);

// Get child's progress/grades (protected)
parentRoute.get("/children/:studentId/progress", authenticate, requireParent, getChildProgress);

export default parentRoute;