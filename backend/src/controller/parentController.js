import { myDataSource } from "../config/db.js";

const parentRepo = myDataSource.getRepository("Parent");
const studentRepo = myDataSource.getRepository("Student");
const userRepo = myDataSource.getRepository("User");
const attendanceRepo = myDataSource.getRepository("Attendance");
const paymentRepo = myDataSource.getRepository("Payment");
const assessmentResultRepo = myDataSource.getRepository("AssessmentResult");
const studentClassRepo = myDataSource.getRepository("StudentClass");

// Get parent's profile information
export const getParentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const parent = await parentRepo.findOne({
      where: { userId },
      relations: ["user"],
    });

    if (!parent) {
      return res.status(404).json({
        code: 404,
        message: "Parent profile not found",
      });
    }

    return res.json({
      code: 200,
      data: {
        parentId: parent.parentId,
        fullName: parent.fullName,
        contact: parent.contact,
        email: parent.user.email,
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

// Get parent's children
export const getChildren = async (req, res) => {
  try {
    const userId = req.user.id;

    const parent = await parentRepo.findOne({
      where: { userId },
      relations: ["students", "students.user"],
    });

    if (!parent) {
      return res.status(404).json({
        code: 404,
        message: "Parent profile not found",
      });
    }

    return res.json({
      code: 200,
      data: parent.students || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Get child's attendance
export const getChildAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { studentId } = req.params;

    // Verify parent owns this child
    const parent = await parentRepo.findOne({
      where: { userId },
      relations: ["students"],
    });

    if (!parent) {
      return res.status(404).json({
        code: 404,
        message: "Parent profile not found",
      });
    }

    const isParentChild = parent.students.some(
      (student) => student.studentId === parseInt(studentId)
    );

    if (!isParentChild) {
      return res.status(403).json({
        code: 403,
        message: "Access denied. This child does not belong to you",
      });
    }

    const attendance = await attendanceRepo.find({
      where: { studentId: parseInt(studentId) },
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

// Get child's payments
export const getChildPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { studentId } = req.params;

    // Verify parent owns this child
    const parent = await parentRepo.findOne({
      where: { userId },
      relations: ["students"],
    });

    if (!parent) {
      return res.status(404).json({
        code: 404,
        message: "Parent profile not found",
      });
    }

    const isParentChild = parent.students.some(
      (student) => student.studentId === parseInt(studentId)
    );

    if (!isParentChild) {
      return res.status(403).json({
        code: 403,
        message: "Access denied. This child does not belong to you",
      });
    }

    const payments = await paymentRepo.find({
      where: { studentId: parseInt(studentId) },
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

// Get child's progress/grades
export const getChildProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { studentId } = req.params;

    // Verify parent owns this child
    const parent = await parentRepo.findOne({
      where: { userId },
      relations: ["students"],
    });

    if (!parent) {
      return res.status(404).json({
        code: 404,
        message: "Parent profile not found",
      });
    }

    const isParentChild = parent.students.some(
      (student) => student.studentId === parseInt(studentId)
    );

    if (!isParentChild) {
      return res.status(403).json({
        code: 403,
        message: "Access denied. This child does not belong to you",
      });
    }

    const results = await assessmentResultRepo.find({
      where: { studentId: parseInt(studentId) },
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

// Sync parent data from user table
export const syncParentUser = async (req, res) => {
  try {
    const parentUsers = await userRepo.find({
      relations: ["parentProfile"],
      where: {
        userType: "parent",
      },
    });

    if (!parentUsers || parentUsers.length === 0) {
      return res.json({
        code: 404,
        message: "No parent users found",
      });
    }

    const newSyncedParents = [];

    for (let user of parentUsers) {
      if (!user.parentProfile) {
        const newParent = await parentRepo.create({
          userId: user.id,
          fullName: user.firstName + " " + user.lastName,
          contact: user.email, // Use email as default contact
        });

        await parentRepo.save(newParent);
        newSyncedParents.push(newParent);
      }
    }

    return res.json({
      code: 200,
      message: "Parents synced successfully",
      data: newSyncedParents,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "Internal server error",
    });
  }
};

// Link a student to a parent
export const linkStudent = async (req, res) => {
  try {
    const parentUserId = req.user.id;
    const { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({
        code: 400,
        message: "Student email is required",
      });
    }

    // Find parent profile
    const parent = await parentRepo.findOne({
      where: { userId: parentUserId },
    });

    if (!parent) {
      return res.status(404).json({
        code: 404,
        message: "Parent profile not found. Please sync your profile first.",
      });
    }

    // Find student by email
    const studentUser = await userRepo.findOne({
      where: { email: studentEmail, userType: "student" },
      relations: ["studentProfile"],
    });

    if (!studentUser || !studentUser.studentProfile) {
      return res.status(404).json({
        code: 404,
        message: "Student not found with that email address",
      });
    }

    const student = studentUser.studentProfile;

    // Check if already linked
    if (student.parentId === parent.parentId) {
       return res.status(400).json({
           code: 400,
           message: "This student is already linked to your account",
       });
    }

    // Update student's parentId
    await studentRepo.update(
      { studentId: student.studentId },
      { parentId: parent.parentId }
    );

    return res.json({
      code: 200,
      message: "Student linked successfully",
      data: {
        studentId: student.studentId,
        fullName: student.fullName,
      }
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};