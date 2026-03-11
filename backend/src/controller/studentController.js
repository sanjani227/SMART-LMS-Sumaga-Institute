import { myDataSource } from "../config/db.js";
import { UserType } from "../utils/enum.js";
import { In } from "typeorm";

const studentRepo = myDataSource.getRepository("Student");
const userRepo = myDataSource.getRepository("User");
const studentClassRepo = myDataSource.getRepository("StudentClass");
const classRepo = myDataSource.getRepository("Class");
const attendanceRepo = myDataSource.getRepository("Attendance");
const paymentRepo = myDataSource.getRepository("Payment");
const assignmentRepo = myDataSource.getRepository("Assignment");
const assignmentSubmissionRepo = myDataSource.getRepository("AssignmentSubmission");
const assessmentRepo = myDataSource.getRepository("Assessment");
const assessmentResultRepo = myDataSource.getRepository("AssessmentResult");
const studyMaterialRepo = myDataSource.getRepository("StudyMaterial");

// Get student's enrolled classes
export const getStudentClasses = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await studentRepo.findOne({
      where: { userId },
      relations: [
        "enrollments", 
        "enrollments.class", 
        "enrollments.class.subject", 
        "enrollments.class.teacher"
      ],
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    const activeEnrollments = student.enrollments.filter(
      enrollment => enrollment.status === "active" && !enrollment.class.isDeleted
    );

    return res.json({
      code: 200,
      data: {
        studentId: student.studentId,
        fullName: student.fullName,
        grade: student.grade,
        classes: activeEnrollments.map(enrollment => ({
          classId: enrollment.class.classId,
          subject: enrollment.class.subject,
          teacher: enrollment.class.teacher,
          scheduleDay: enrollment.class.scheduleDay,
          scheduleTime: enrollment.class.scheduleTime,
          enrollmentStatus: enrollment.status,
          enrollmentDate: enrollment.enrollmentDate,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get student's study materials
export const getStudentStudyMaterials = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await studentRepo.findOne({
      where: { userId },
      relations: ["enrollments", "enrollments.class", "enrollments.class.subject"],
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    // Get subjects the student is enrolled in
    const enrolledSubjects = student.enrollments
      .filter(enrollment => enrollment.status === "active" && !enrollment.class.isDeleted)
      .map(enrollment => enrollment.class.subject.subjectName);

    if (enrolledSubjects.length === 0) {
      return res.json({
        code: 200,
        data: [],
        message: "No enrolled subjects found",
      });
    }

    // Get materials for student's grade AND enrolled subjects
    const materials = await studyMaterialRepo.find({
      where: {
        grade: student.grade,
      },
      relations: ["teacher", "subject"],
      order: { fileId: "DESC" },
    });

    // Filter materials by enrolled subjects
    const filteredMaterials = materials.filter(material =>
      enrolledSubjects.includes(material.subject?.subjectName)
    );

    return res.json({
      code: 200,
      data: filteredMaterials,
      enrolledSubjects: enrolledSubjects,
    });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get student's assignments
export const getStudentAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await studentRepo.findOne({
      where: { userId },
      relations: ["enrollments", "enrollments.class"],
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    const classIds = student.enrollments
      .filter(enrollment => enrollment.status === "active")
      .map(enrollment => enrollment.class.classId);

    const assignments = await assignmentRepo.find({
      where: { classId: In(classIds) },
      relations: ["class", "class.subject", "submissions"],
      order: { dueDate: "ASC" },
    });

    // Check submission status for each assignment
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = assignment.submissions.find(
        sub => sub.studentId === student.studentId
      );
      return {
        ...assignment,
        submissionStatus: submission ? submission.status : "not_submitted",
        submission: submission || null,
      };
    });

    return res.json({
      code: 200,
      data: assignmentsWithStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get student's assessments/quizzes
export const getStudentAssessments = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await studentRepo.findOne({
      where: { userId },
      relations: ["enrollments", "enrollments.class"],
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    const classIds = student.enrollments
      .filter(enrollment => enrollment.status === "active")
      .map(enrollment => enrollment.class.classId);

    const assessments = await assessmentRepo.find({
      where: { classId: In(classIds), isActive: true },
      relations: ["classSession", "classSession.subject", "results"],
      order: { startTime: "ASC" },
    });

    // Check assessment results for each
    const assessmentsWithResults = assessments.map(assessment => {
      const result = assessment.results.find(
        res => res.studentId === student.studentId
      );
      return {
        ...assessment,
        studentResult: result || null,
        status: result ? result.status : "not_started",
      };
    });

    return res.json({
      code: 200,
      data: assessmentsWithResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get student's attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await studentRepo.findOne({
      where: { userId },
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    const attendance = await attendanceRepo.find({
      where: { studentId: student.studentId },
      relations: ["classSession", "classSession.subject"],
      order: { attendanceDate: "DESC" },
    });

    return res.json({
      code: 200,
      data: attendance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get student's payments
export const getStudentPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await studentRepo.findOne({
      where: { userId },
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    const payments = await paymentRepo.find({
      where: { studentId: student.studentId },
      order: { createdAt: "DESC" },
    });

    return res.json({
      code: 200,
      data: payments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get student's progress/results
export const getStudentProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await studentRepo.findOne({
      where: { userId },
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    const results = await assessmentResultRepo.find({
      where: { studentId: student.studentId },
      relations: ["assessment", "assessment.classSession", "assessment.classSession.subject"],
      order: { completedAt: "DESC" },
    });

    return res.json({
      code: 200,
      data: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Enroll student in a class
export const enrollInClass = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.body;

    const student = await studentRepo.findOne({
      where: { userId },
    });

    if (!student) {
      return res.status(404).json({
        code: 404,
        message: "Student profile not found",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await studentClassRepo.findOne({
      where: {
        studentId: student.studentId,
        classId: classId,
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        code: 409,
        message: "Already enrolled in this class",
      });
    }

    const enrollment = await studentClassRepo.create({
      studentId: student.studentId,
      classId: classId,
      status: "active",
    });

    await studentClassRepo.save(enrollment);

    return res.json({
      code: 200,
      message: "Successfully enrolled in class",
      data: enrollment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const getCourses = async (req, res) => {
  const { studentId, email, userRole } = req.body;

  if (!id || !email || !userRole) {
    return res.json({
      code: 403,
      message: "unauthorized",
    });
  }
};

export const syncStudentUser = async (req, res) => {
  try {
    const studentUser = await userRepo.find({
      relations: ["studentProfile"],
      where: {
        userType: "student",
      },
    });

    console.log(studentUser);

    if (!studentUser || studentUser.length == 0) {
      return res.json({
        code: 404,
        message: "No students found",
      });
    }

    const newSyncedStudent = []

    for(let student of studentUser){
      if(!student.studentProfile) {
          const newUser = await studentRepo.create({
              userId : student.id,
              fullName: student.firstName + " " + student.lastName,
              dob: null,
              address: null,
              grade: null,
              parentId: null
          })

          await studentRepo.save(newUser)
          newSyncedStudent.push(newUser)
      }
    }

    return res.json({
    code: 200,
    message: "Students synced",
    data: newSyncedStudent,
  });
    
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "Internal server error",
    });
  }
};
