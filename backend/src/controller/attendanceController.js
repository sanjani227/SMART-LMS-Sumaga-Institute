import { myDataSource } from "../config/db.js";
import { In } from "typeorm";

const attendanceRepo = myDataSource.getRepository("Attendance");
const teacherRepo = myDataSource.getRepository("Teacher");
const classRepo = myDataSource.getRepository("Class");
const studentRepo = myDataSource.getRepository("Student");
const studentClassRepo = myDataSource.getRepository("StudentClass");

// Get students for attendance marking (specific class)
export const getStudentsForAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.params;
    const { date } = req.query;

    if (!classId) {
      return res.status(400).json({
        code: 400,
        message: "Class ID is required",
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

    const ownsClass = teacher.classes.some(
      (cls) => cls.classId === parseInt(classId) && !cls.isDeleted
    );

    if (!ownsClass) {
      return res.status(403).json({
        code: 403,
        message: "You can only take attendance for your own classes",
      });
    }

    // Get enrolled students
    const enrollments = await studentClassRepo.find({
      where: {
        classId: parseInt(classId),
        status: "active",
      },
      relations: ["student", "student.user", "class", "class.subject"],
    });

    const attendanceDate = date ? date : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

    // Check existing attendance for this date
    const existingAttendance = await attendanceRepo.find({
      where: {
        classId: parseInt(classId),
        attendanceDate: attendanceDate,
      },
    });

    // Map existing attendance by student ID
    const attendanceMap = {};
    existingAttendance.forEach(att => {
      attendanceMap[att.studentId] = att;
    });

    // Combine enrollment data with attendance status
    const studentsWithAttendance = enrollments.map(enrollment => ({
      ...enrollment.student,
      class: enrollment.class,
      enrollment: enrollment,
      attendance: attendanceMap[enrollment.student.studentId] || null,
    }));

    return res.json({
      code: 200,
      data: {
        classInfo: enrollments[0]?.class || null,
        date: attendanceDate,
        students: studentsWithAttendance,
      },
    });
  } catch (error) {
    console.error("Error fetching students for attendance:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Mark attendance for students
export const markAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId, attendanceData, date } = req.body;

    if (!classId || !attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({
        code: 400,
        message: "Class ID and attendance data array are required",
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

    const ownsClass = teacher.classes.some(
      (cls) => cls.classId === parseInt(classId) && !cls.isDeleted
    );

    if (!ownsClass) {
      return res.status(403).json({
        code: 403,
        message: "You can only mark attendance for your own classes",
      });
    }

    const attendanceDate = date ? date : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

    const savedAttendance = [];

    for (const data of attendanceData) {
      const { studentId, status, remarks } = data;

      if (!studentId || !status) {
        continue;
      }

      // Check if attendance already exists
      let attendance = await attendanceRepo.findOne({
        where: {
          studentId: parseInt(studentId),
          classId: parseInt(classId),
          attendanceDate: attendanceDate,
        },
      });

      if (attendance) {
        // Update existing attendance
        await attendanceRepo.update(
          { attendanceId: attendance.attendanceId },
          {
            status,
            remarks: remarks || null,
            updatedAt: new Date(),
          }
        );
        
        attendance = await attendanceRepo.findOne({
          where: { attendanceId: attendance.attendanceId },
          relations: ["student"],
        });
      } else {
        // Create new attendance record
        attendance = await attendanceRepo.create({
          studentId: parseInt(studentId),
          classId: parseInt(classId),
          attendanceDate: attendanceDate,
          status,
          remarks: remarks || null,
        });
        
        await attendanceRepo.save(attendance);
        
        attendance = await attendanceRepo.findOne({
          where: { attendanceId: attendance.attendanceId },
          relations: ["student"],
        });
      }

      savedAttendance.push(attendance);
    }

    return res.json({
      code: 200,
      message: "Attendance marked successfully",
      data: savedAttendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get attendance history for a class
export const getClassAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

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

    const ownsClass = teacher.classes.some(
      (cls) => cls.classId === parseInt(classId) && !cls.isDeleted
    );

    if (!ownsClass) {
      return res.status(403).json({
        code: 403,
        message: "Access denied",
      });
    }

    let whereConditions = { classId: parseInt(classId) };

    // Add date filtering if provided
    if (startDate && endDate) {
      whereConditions.attendanceDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const attendance = await attendanceRepo.find({
      where: whereConditions,
      relations: ["student", "student.user", "classSession", "classSession.subject"],
      order: { attendanceDate: "DESC", studentId: "ASC" },
    });

    // Group by date for easier display
    const attendanceByDate = {};
    attendance.forEach(att => {
      const d = att.attendanceDate;
      const dateStr = typeof d === 'string' ? d.split('T')[0] : d.toISOString().split('T')[0];
      if (!attendanceByDate[dateStr]) {
        attendanceByDate[dateStr] = [];
      }
      attendanceByDate[dateStr].push(att);
    });

    return res.json({
      code: 200,
      data: attendanceByDate,
    });
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get attendance summary for teacher's classes
export const getTeacherAttendanceSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacher = await teacherRepo.findOne({
      where: { userId },
      relations: ["classes", "classes.subject"],
    });

    if (!teacher) {
      return res.status(404).json({
        code: 404,
        message: "Teacher profile not found",
      });
    }

    const classIds = teacher.classes
      .filter(cls => !cls.isDeleted)
      .map(cls => cls.classId);

    if (classIds.length === 0) {
      return res.json({
        code: 200,
        data: [],
      });
    }

    const attendance = await attendanceRepo.find({
      where: { classId: In(classIds) },
      relations: ["student", "classSession", "classSession.subject"],
    });

    // Group by class and calculate statistics
    const summary = {};
    teacher.classes.filter(cls => !cls.isDeleted).forEach(cls => {
      summary[cls.classId] = {
        class: cls,
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
      };
    });

    attendance.forEach(att => {
      const classId = att.classId;
      if (summary[classId]) {
        summary[classId].totalRecords++;
        switch (att.status) {
          case 'present':
            summary[classId].presentCount++;
            break;
          case 'absent':
            summary[classId].absentCount++;
            break;
          case 'late':
            summary[classId].lateCount++;
            break;
          case 'excused':
            summary[classId].excusedCount++;
            break;
        }
      }
    });

    return res.json({
      code: 200,
      data: Object.values(summary),
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};