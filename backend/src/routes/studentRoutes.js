/**
 * ========== STUDENT ROUTES ==========
 * File: backend/src/routes/studentRoutes.js
 * Purpose: Define endpoints for student operations
 * 
 * @section Imports
 */
import express from 'express';
import { 
  syncStudentUser,
  getStudentClasses,
  getAvailableClasses,
  getStudentStudyMaterials,
  getStudentAssignments,
  getStudentAssessments,
  getStudentAttendance,
  getStudentPayments,
  getStudentProgress,
  enrollInClass,
  getStudentSettings,
  updateStudentParent,
  processPayment,
  updateStudentProfile,
} from '../controller/studentController.js';
import { authenticate, requireStudent } from '../middleware/authentication.js';

// ========== STUDENT ROUTES INITIALIZATION ==========
const studentRoute = express.Router();

// ========== STUDENT PROFILE & SETTINGS ==========

// Sync student data
studentRoute.get("/sync", syncStudentUser);

// Get student's classes (protected)
studentRoute.get("/classes", authenticate, requireStudent, getStudentClasses);

// Get classes available for enrollment (protected)
studentRoute.get("/available-classes", authenticate, requireStudent, getAvailableClasses);

// Get student's study materials (protected)
studentRoute.get("/materials", authenticate, requireStudent, getStudentStudyMaterials);

// Get student's assignments (protected)
studentRoute.get("/assignments", authenticate, requireStudent, getStudentAssignments);

// Get student's assessments/quizzes (protected)
studentRoute.get("/assessments", authenticate, requireStudent, getStudentAssessments);

// Get student's attendance (protected)
studentRoute.get("/attendance", authenticate, requireStudent, getStudentAttendance);

// Get student's payments (protected)
studentRoute.get("/payments", authenticate, requireStudent, getStudentPayments);

// Get student's progress/results (protected)
studentRoute.get("/progress", authenticate, requireStudent, getStudentProgress);

// Enroll in class (protected)
studentRoute.post("/enroll", authenticate, requireStudent, enrollInClass);

// Student settings (protected)
studentRoute.get("/settings", authenticate, requireStudent, getStudentSettings);

// Update student's parent (protected)
studentRoute.put("/parent", authenticate, requireStudent, updateStudentParent);

// Update student profile (protected)
studentRoute.put("/profile", authenticate, requireStudent, updateStudentProfile);

// Process payment (protected)
studentRoute.post("/payments/:paymentId/pay", authenticate, requireStudent, processPayment);

export default studentRoute;