import { where } from "sequelize";
import { myDataSource } from "../config/db.js";
import { UserType } from "../utils/enum.js";
import { Not, In, Like } from "typeorm";

const teacherRepo = myDataSource.getRepository("Teacher");
const userRepo = myDataSource.getRepository("User");
const studyMaterialRepo = myDataSource.getRepository("StudyMaterial");
const subjectRepo = myDataSource.getRepository("Subject");

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherRepo.find({
      order: {
        teacherId: "ASC",
      },
    });

    console.log(teachers);
    return res.json({
      code: 200,
      message: "query successfull",
      data: teachers,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "internal server error",
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { fullName, specialization, userId } = req.body;

    const teacher = await userRepo.find({
      where: {
        id: userId,
        userType: "teacher" || "TEACHER",
      },
    });

    console.log(teacher);
    if (teacher.length == 0) {
      return res.json({
        code: 404,
        message: "Teacher not found",
      });
    }

    const newTeacher = await teacherRepo.update(
      { userId: teacher[0].id },
      {
        // fields to update
        fullName: teacher[0].firstName + " " + teacher[0].lastName,
        specialization: specialization,
      },
    );

    console.log(newTeacher);

    // if (newTeacher) {
    //   return res.json({
    //     code: 403,
    //     message: "Teacher already available",
    //   });
    // }

    // await teacherRepo.save(newTeacher);

    return res.json({
      code: 200,
      message: "teacher related data saved",
      data: newTeacher,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const autoUpdateTeacherFromAllUsers = async (req, res) => {
  try {
    const userTeachers = await userRepo.find({
      relations: ["teacherProfile"],
      where: {
        userType: "teacher",
      },
    });

    console.log(userTeachers);

    if (!userTeachers || userTeachers.length == 0) {
      return res.json({
        code: 404,
        message: "No teachers found",
      });
    }

    const newSyncedTeacher = [];

    for (let teacher of userTeachers) {
      if (!teacher.teacherProfile) {
        const newTeacher = await teacherRepo.create({
          userId: teacher.id,
          fullName: teacher.firstName + " " + teacher.lastName,
          specialization: null,
        });
        await teacherRepo.save(newTeacher);
        newSyncedTeacher.push(newTeacher);
      }
    }

    return res.json({
      code: 200,
      message: "Teachers synced",
      data: newSyncedTeacher,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }

  // console.log(notSyncedTeachers)
};

export const classesForTeacher = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacher = await teacherRepo.find({
      where: { userId },
      relations: ["user", "classes", "classes.subject"],
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ code: 404, message: "Teacher profile not found" });
    }

    console.log({
      teacherId: teacher[0].teacherId,
      fullName: teacher.fullName,
      email: teacher.user?.email,
      classes: teacher.classes?.filter((c) => !c.isDeleted) ?? [],
    });

    return res.json({
      code: 200,
      data: {
        teacherId: teacher[0].teacherId,
        fullName: teacher[0].fullName,
        email: teacher[0].user?.email,
        classes: teacher[0].classes?.filter((c) => !c.isDeleted) ?? [],
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, message: "Internal server error" });
  }
};

export const uploadStudyMaterials = async (req, res) => {
  try {
    const files = req.files;
    // Extract everything frontend might send
    const { grade, classId, title, description } = req.body;
    const teacherId = req.user.id;

    const teacher = await teacherRepo.findOne({
      where: { userId: teacherId },
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher not found",
      });
    }

    let subjectIdContext = null;
    let actualGrade = grade || 1; // Default fallback

    // Attempt to get subject from classId if provided by our new frontend
    if (classId) {
       const classRepo = myDataSource.getRepository("Class");
       const classInfo = await classRepo.findOne({
           where: { classId: parseInt(classId) },
           relations: ["subject"]
       });
       if (classInfo && classInfo.subject) {
           subjectIdContext = classInfo.subject.subjectId;
           // If grade wasn't explicitly provided, extract from subject if possible
           // (Assuming subject.gradeLevel exists, fall back if not)
           actualGrade = classInfo.subject.gradeLevel || grade || 1;
       }
    }

    // Fallback to teacher's specialization if subjectId Context is still null
    if (!subjectIdContext && teacher.specialization) {
      const subject = await subjectRepo.findOne({
        where: {
          subjectName: teacher.specialization,
        },
      });
      if (subject) {
        subjectIdContext = subject.subjectId;
      }
    }

    if (!subjectIdContext) {
       return res.status(400).json({
          code: 400,
          message: "Could not determine subject. Please update your profile specialization or select a valid class."
       });
    }

    if (!files || files.length == 0) {
      return res.status(400).json({
        code: 400,
        message: "No files found",
      });
    }

    const savedMaterials = [];

    for (let file of files) {
      let numericGrade = 1;
      if (actualGrade) {
         const match = String(actualGrade).match(/\d+/);
         if (match) numericGrade = parseInt(match[0], 10);
      }

      let studyMaterial = await studyMaterialRepo.create({
        fileName: title ? `${title} - ${file.filename}` : file.filename, // Keep title in filename for display
        grade: numericGrade,
        teacherId: teacher.teacherId,
        subjectId: subjectIdContext,
      });

      studyMaterial = await studyMaterialRepo.save(studyMaterial);
      savedMaterials.push(studyMaterial);
    }

    // console.log(await studyMaterialRepo.find({
    //     order : {
    //         fileId : "ASC"
    //     }
    // }))

    // console.log(savedMaterials);

    return res.json({
      code: 200,
      message: "File upload successful",
      time: Date(Date.UTC()),
      data: savedMaterials,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 500, message: "Internal server error" });
  }
};

export const getUploadedStudyMaterials = async (req, res) => {
  try {
    const studyMaterials = await studyMaterialRepo.find({
        order: {
            fileId : "ASC"
        },
        relations: ["teacher"]
    });

    const formattedData = studyMaterials.map(mat => {
        let displayTitle = mat.fileName;
        let actualFileUrl = "uploads/" + mat.fileName;
        if (mat.fileName.includes(" - ")) {
           const parts = mat.fileName.split(" - ");
           displayTitle = parts[0];
           actualFileUrl = "uploads/" + parts.slice(1).join(" - ");
        }

        return {
            materialId: mat.fileId,
            title: displayTitle,
            description: "", 
            classId: mat.subjectId, 
            fileUrl: actualFileUrl,
            createdAt: mat.createdAt
        };
    });

    return res.json({
        code: 200,
        data: formattedData
    });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 500, message: "Internal server error" });
  }
};

// Update teacher's specialization/subject
export const updateTeacherSpecialization = async (req, res) => {
  try {
    const userId = req.user.id;
    const { specialization } = req.body;

    if (!specialization) {
      return res.status(400).json({
        code: 400,
        message: "Specialization is required",
      });
    }

    // Check if specialization exists as a subject (fuzzy match for grade modifiers)
    const subject = await subjectRepo.findOne({
      where: { subjectName: Like(`${specialization}%`) },
    });

    if (!subject) {
      return res.status(404).json({
        code: 404,
        message: "Subject not found. Please contact admin to add this subject.",
      });
    }

    const teacher = await teacherRepo.findOne({
      where: { userId },
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    // Update specialization
    await teacherRepo.update(
      { teacherId: teacher.teacherId },
      { specialization: specialization }
    );

    const updatedTeacher = await teacherRepo.findOne({
      where: { teacherId: teacher.teacherId },
      relations: ["user"],
    });

    return res.json({
      code: 200,
      message: "Specialization updated successfully",
      data: updatedTeacher,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get teacher's current specialization
export const getTeacherSpecialization = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: ["user"],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    return res.json({
      code: 200,
      data: {
        teacherId: teacher.teacherId,
        fullName: teacher.fullName,
        specialization: teacher.specialization,
        email: teacher.user?.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get students in teacher's classes
export const getTeacherStudents = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: [
        "classes",
        "classes.enrolledStudents",
        "classes.enrolledStudents.student",
        "classes.enrolledStudents.student.user",
      ],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    const students = [];
    teacher.classes.forEach(cls => {
      cls.enrolledStudents.forEach(enrollment => {
        if (enrollment.status === "active") {
          students.push({
            studentId: enrollment.student.studentId,
            fullName: enrollment.student.fullName,
            grade: enrollment.student.grade,
            email: enrollment.student.user?.email,
            classInfo: {
              classId: cls.classId,
              scheduleDay: cls.scheduleDay,
              scheduleTime: cls.scheduleTime,
            },
          });
        }
      });
    });

    return res.json({
      code: 200,
      data: students,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get detailed student performance for teacher's classes
export const getStudentPerformanceBulk = async (req, res) => {
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

    // Get students enrolled in these classes
    const studentClassRepo = myDataSource.getRepository("StudentClass");
    const attendanceRepo = myDataSource.getRepository("Attendance");
    const assessmentResultRepo = myDataSource.getRepository("AssessmentResult");
    const assignmentSubmissionRepo = myDataSource.getRepository("AssignmentSubmission");

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

    const studentIds = enrollments.map(e => e.student.studentId);

    if (studentIds.length === 0) {
      return res.json({
        code: 200,
        data: [],
      });
    }

    // Get attendance data
    const attendance = await attendanceRepo.find({
      where: {
        studentId: In(studentIds),
        classId: In(classIds),
      },
    });

    // Get assessment results
    const assessmentResults = await assessmentResultRepo.find({
      where: {
        studentId: In(studentIds),
      },
      relations: ["assessment", "assessment.classSession"],
    });

    // Get assignment submissions
    const assignmentSubmissions = await assignmentSubmissionRepo.find({
      where: {
        studentId: In(studentIds),
      },
      relations: ["assignment", "assignment.class"],
    });

    // Process data for each student
    const studentPerformance = enrollments.map(enrollment => {
      const student = enrollment.student;
      const studentAttendance = attendance.filter(a => a.studentId === student.studentId);
      const studentAssessments = assessmentResults.filter(r => r.studentId === student.studentId);
      const studentAssignments = assignmentSubmissions.filter(s => s.studentId === student.studentId);

      // Calculate attendance statistics
      const totalAttendanceDays = studentAttendance.length;
      const presentDays = studentAttendance.filter(a => a.status === 'present').length;
      const attendancePercentage = totalAttendanceDays > 0 ? (presentDays / totalAttendanceDays) * 100 : 0;

      // Calculate assessment average
      const completedAssessments = studentAssessments.filter(a => a.status === 'completed');
      const assessmentAverage = completedAssessments.length > 0
        ? completedAssessments.reduce((sum, a) => sum + a.percentage, 0) / completedAssessments.length
        : 0;

      // Calculate assignment average
      const gradedAssignments = studentAssignments.filter(a => a.status === 'graded' && a.score);
      const assignmentAverage = gradedAssignments.length > 0
        ? gradedAssignments.reduce((sum, a) => sum + (a.score / a.assignment.maxScore) * 100, 0) / gradedAssignments.length
        : 0;

      return {
        student: {
          studentId: student.studentId,
          fullName: student.fullName,
          grade: student.grade,
          email: student.user?.email,
        },
        class: enrollment.class,
        performance: {
          attendance: {
            totalDays: totalAttendanceDays,
            presentDays: presentDays,
            percentage: Math.round(attendancePercentage * 100) / 100,
          },
          assessments: {
            completed: completedAssessments.length,
            average: Math.round(assessmentAverage * 100) / 100,
          },
          assignments: {
            submitted: studentAssignments.length,
            graded: gradedAssignments.length,
            average: Math.round(assignmentAverage * 100) / 100,
          },
          overallGrade: calculateOverallGrade(attendancePercentage, assessmentAverage, assignmentAverage),
        },
      };
    });

    return res.json({
      code: 200,
      data: studentPerformance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Helper function to calculate overall grade
function calculateOverallGrade(attendancePerc, assessmentAvg, assignmentAvg) {
  // Weighted average: 30% attendance, 40% assessments, 30% assignments
  const overall = (attendancePerc * 0.3) + (assessmentAvg * 0.4) + (assignmentAvg * 0.3);
  
  if (overall >= 90) return 'A+';
  if (overall >= 85) return 'A';
  if (overall >= 80) return 'B+';
  if (overall >= 75) return 'B';
  if (overall >= 70) return 'C+';
  if (overall >= 65) return 'C';
  if (overall >= 60) return 'D';
  return 'F';
}
