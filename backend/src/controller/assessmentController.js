import { myDataSource } from "../config/db.js";

const assessmentRepo = myDataSource.getRepository("Assessment");
const questionRepo = myDataSource.getRepository("Question");
const teacherRepo = myDataSource.getRepository("Teacher");

// Create assessment (quiz) with questions
export const createAssessment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId, title, description, type, duration, startTime, endTime, questions } = req.body;

    if (!classId || !title || !startTime || !endTime) {
      return res.status(400).json({
        code: 400,
        message: "Class ID, title, startTime, and endTime are required",
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
        message: "You can only create quizzes for your own classes",
      });
    }

    // Calculate total marks from questions
    let totalMarks = 0;
    if (questions && questions.length > 0) {
      totalMarks = questions.reduce((sum, q) => sum + (q.points || 1), 0);
    } else {
      totalMarks = 100; // Default if no questions yet
    }

    // Create the assessment
    const assessment = await assessmentRepo.create({
      classId: parseInt(classId),
      title,
      description: description || null,
      type: type || "quiz",
      duration: duration || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      totalMarks,
    });

    await assessmentRepo.save(assessment);

    // Save questions if provided
    if (questions && questions.length > 0) {
      const questionEntities = questions.map((q, index) => {
        return questionRepo.create({
          assessmentId: assessment.assessmentId,
          questionText: q.questionText,
          questionType: q.questionType || "multiple_choice",
          options: q.options || null,
          correctAnswer: q.correctAnswer || null,
          points: q.points || 1,
          order: q.order || index + 1,
        });
      });
      await questionRepo.save(questionEntities);
    }

    const savedAssessment = await assessmentRepo.findOne({
      where: { assessmentId: assessment.assessmentId },
      relations: ["classSession", "classSession.subject", "questions"],
    });

    return res.json({
      code: 200,
      message: "Quiz created successfully",
      data: savedAssessment,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get teacher's assessments (quizzes)
export const getTeacherAssessments = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: [
        "classes",
        "classes.assessments",
        "classes.assessments.classSession",
        "classes.assessments.classSession.subject",
        "classes.assessments.questions",
      ],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    // Flatten assessments from all classes
    const assessments = [];
    teacher.classes.forEach((cls) => {
      if (!cls.isDeleted && cls.assessments) {
        cls.assessments.forEach((assessment) => {
          assessments.push({
            ...assessment,
            questionCount: assessment.questions ? assessment.questions.length : 0,
            classSession: cls, // Ensure class context is there
          });
        });
      }
    });

    // Sort by creation date (newest first)
    assessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      code: 200,
      data: assessments,
    });
  } catch (error) {
    console.error("Error fetching teacher quizzes:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
