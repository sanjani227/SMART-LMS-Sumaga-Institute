import { myDataSource } from "../config/db.js";
import { In } from "typeorm";

const assignmentRepo = myDataSource.getRepository("Assignment");
const assignmentSubmissionRepo = myDataSource.getRepository("AssignmentSubmission");
const teacherRepo = myDataSource.getRepository("Teacher");
const classRepo = myDataSource.getRepository("Class");
const studentRepo = myDataSource.getRepository("Student");
const studentClassRepo = myDataSource.getRepository("StudentClass");

// Create assignment for teacher's class
export const createAssignment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId, title, description, dueDate, maxScore, attachmentPath } = req.body;

    if (!classId || !title || !dueDate) {
      return res.status(400).json({
        code: 400,
        message: "Class ID, title, and due date are required",
      });
    }

    // Verify teacher owns this class
    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: ["classes"],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    const teacherOwnsClass = teacher.classes.some(
      (cls) => cls.classId === parseInt(classId) && !cls.isDeleted
    );

    if (!teacherOwnsClass) {
      return res.status(403).json({
        code: 403,
        message: "You can only create assignments for your own classes",
      });
    }

    const assignment = await assignmentRepo.create({
      classId: parseInt(classId),
      title,
      description: description || null,
      dueDate: new Date(dueDate),
      maxScore: maxScore || 100,
      attachmentPath: attachmentPath || null,
    });

    await assignmentRepo.save(assignment);

    const savedAssignment = await assignmentRepo.findOne({
      where: { assignmentId: assignment.assignmentId },
      relations: ["class", "class.subject"],
    });

    return res.json({
      code: 200,
      message: "Assignment created successfully",
      data: savedAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get teacher's assignments
export const getTeacherAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: [
        "classes",
        "classes.assignments",
        "classes.assignments.class",
        "classes.assignments.class.subject",
        "classes.assignments.submissions",
        "classes.assignments.submissions.student",
      ],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    // Flatten assignments from all classes
    const assignments = [];
    teacher.classes.forEach((cls) => {
      if (!cls.isDeleted) {
        cls.assignments.forEach((assignment) => {
          assignments.push({
            ...assignment,
            submissionCount: assignment.submissions.length,
            class: cls,
          });
        });
      }
    });

    // Sort by creation date (newest first)
    assignments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      code: 200,
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching teacher assignments:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get assignment submissions for a specific assignment
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { assignmentId } = req.params;

    // Verify teacher owns this assignment
    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: ["classes", "classes.assignments"],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    let ownsAssignment = false;
    teacher.classes.forEach((cls) => {
      if (!cls.isDeleted) {
        cls.assignments.forEach((assignment) => {
          if (assignment.assignmentId === parseInt(assignmentId)) {
            ownsAssignment = true;
          }
        });
      }
    });

    if (!ownsAssignment) {
      return res.status(403).json({
        code: 403,
        message: "Access denied",
      });
    }

    const submissions = await assignmentSubmissionRepo.find({
      where: { assignmentId: parseInt(assignmentId) },
      relations: ["student", "student.user", "assignment"],
      order: { submittedAt: "DESC" },
    });

    return res.json({
      code: 200,
      data: submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Grade assignment submission
export const gradeAssignment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { submissionId } = req.params;
    const { score, feedback } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({
        code: 400,
        message: "Score is required",
      });
    }

    // Verify teacher ownership
    const submission = await assignmentSubmissionRepo.findOne({
      where: { submissionId: parseInt(submissionId) },
      relations: ["assignment", "assignment.class", "assignment.class.teacher"],
    });

    if (!submission) {
      return res.status(404).json({
        code: 404,
        message: "Submission not found",
      });
    }

    if (submission.assignment.class.teacher.userId !== userId) {
      return res.status(403).json({
        code: 403,
        message: "Access denied",
      });
    }

    // Update submission
    await assignmentSubmissionRepo.update(
      { submissionId: parseInt(submissionId) },
      {
        score: parseFloat(score),
        feedback: feedback || null,
        status: "graded",
        gradedAt: new Date(),
      }
    );

    const updatedSubmission = await assignmentSubmissionRepo.findOne({
      where: { submissionId: parseInt(submissionId) },
      relations: ["student", "assignment"],
    });

    return res.json({
      code: 200,
      message: "Assignment graded successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    console.error("Error grading assignment:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get students enrolled in teacher's classes  
export const getStudentsInTeacherClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.query;

    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: ["classes"],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    let classIds;
    if (classId) {
      // Check if teacher owns this specific class
      const ownsClass = teacher.classes.some(
        (cls) => cls.classId === parseInt(classId) && !cls.isDeleted
      );
      if (!ownsClass) {
        return res.status(403).json({
          code: 403,
          message: "Access denied",
        });
      }
      classIds = [parseInt(classId)];
    } else {
      // Get all teacher's class IDs
      classIds = teacher.classes
        .filter((cls) => !cls.isDeleted)
        .map((cls) => cls.classId);
    }

    if (classIds.length === 0) {
      return res.json({
        code: 200,
        data: [],
      });
    }

    const enrollments = await studentClassRepo.find({
      where: {
        classId: In(classIds),
        status: "active",
      },
      relations: [
        "student",
        "student.user",
        "class",
        "class.subject",
      ],
    });

    return res.json({
      code: 200,
      data: enrollments,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};