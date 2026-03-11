import express from 'express';
import { 
  syncStudentUser,
  getStudentClasses,
  getStudentStudyMaterials,
  getStudentAssignments,
  getStudentAssessments,
  getStudentAttendance,
  getStudentPayments,
  getStudentProgress,
  enrollInClass
} from '../controller/studentController.js';
import { authenticate, requireStudent } from '../middleware/authentication.js';

const studentRoute = express.Router();

// Sync student data
studentRoute.get("/sync", syncStudentUser);

// Get student's classes (protected)
studentRoute.get("/classes", authenticate, requireStudent, getStudentClasses);

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

export default studentRoute;