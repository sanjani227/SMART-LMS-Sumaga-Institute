/**
 * ========== TEACHER ROUTES ==========
 * File: backend/src/routes/teacherRoutes.js
 * Purpose: Define endpoints for teacher operations
 * 
 * @section Imports
 */
import express from "express";
import {
  getAllTeachers,
  updateTeacher,
  autoUpdateTeacherFromAllUsers,
  classesForTeacher,
  uploadStudyMaterials,
  getUploadedStudyMaterials,
  deleteStudyMaterial,
  updateTeacherSpecialization,
  getTeacherSpecialization,
  getTeacherStudents,
  getStudentPerformanceBulk,
} from "../controller/teacherController.js";
import {
  createAssignment,
  getTeacherAssignments,
  getAssignmentSubmissions,
  gradeAssignment,
  getStudentsInTeacherClasses,
} from "../controller/assignmentController.js";
import {
  getStudentsForAttendance,
  markAttendance,
  getClassAttendanceHistory,
  getTeacherAttendanceSummary,
} from "../controller/attendanceController.js";
import {
  createAssessment,
  getTeacherAssessments
} from "../controller/assessmentController.js";
import { authenticate, requireTeacher } from "../middleware/authentication.js";
import multer from "multer";
import path from "path";

const teacherRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

teacherRoute.get("/getAllTeacher", getAllTeachers);
teacherRoute.post("/updateTeacher", updateTeacher);
teacherRoute.get("/teacherSync", autoUpdateTeacherFromAllUsers);

// Protected teacher routes
teacherRoute.get("/profile", authenticate, requireTeacher, getTeacherSpecialization);
teacherRoute.put("/specialization", authenticate, requireTeacher, updateTeacherSpecialization);
teacherRoute.get("/classes", authenticate, requireTeacher, classesForTeacher);
teacherRoute.get("/students", authenticate, requireTeacher, getTeacherStudents);
teacherRoute.post("/uploadStudyMaterials", upload.array('files', 10), authenticate, requireTeacher, uploadStudyMaterials);
teacherRoute.get("/getStudyMaterials", authenticate, requireTeacher, getUploadedStudyMaterials);
teacherRoute.delete("/deleteStudyMaterial/:materialId", authenticate, requireTeacher, deleteStudyMaterial);

// Assignment routes
teacherRoute.post("/assignments", authenticate, requireTeacher, createAssignment);
teacherRoute.get("/assignments", authenticate, requireTeacher, getTeacherAssignments);
teacherRoute.get("/assignments/:assignmentId/submissions", authenticate, requireTeacher, getAssignmentSubmissions);
teacherRoute.put("/assignments/submissions/:submissionId/grade", authenticate, requireTeacher, gradeAssignment);

// Quiz / Assessment routes
teacherRoute.post("/quizzes", authenticate, requireTeacher, createAssessment);
teacherRoute.get("/quizzes", authenticate, requireTeacher, getTeacherAssessments);

// Attendance routes
teacherRoute.get("/classes/:classId/students", authenticate, requireTeacher, getStudentsForAttendance);
teacherRoute.post("/attendance", authenticate, requireTeacher, markAttendance);
teacherRoute.get("/classes/:classId/attendance", authenticate, requireTeacher, getClassAttendanceHistory);
teacherRoute.get("/attendance/summary", authenticate, requireTeacher, getTeacherAttendanceSummary);

// Students in teacher's classes
teacherRoute.get("/class-students", authenticate, requireTeacher, getStudentsInTeacherClasses);

// Student performance and analytics
teacherRoute.get("/student-performance", authenticate, requireTeacher, getStudentPerformanceBulk);

export default teacherRoute;
