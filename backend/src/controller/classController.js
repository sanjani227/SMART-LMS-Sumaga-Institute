/**
 * ========== CLASS CONTROLLER ==========
 * File: backend/src/controller/classController.js
 * Purpose: Handle class/section management - retrieve, create, update class information
 * 
 * @section Imports & Database Repositories
 */
import { myDataSource } from "../config/db.js";

// ========== DATABASE REPOSITORY INITIALIZATION ==========
const classRepo = myDataSource.getRepository("Class");
const teacherRepo = myDataSource.getRepository("Teacher");
const subjectRepo = myDataSource.getRepository("Subject");

// ========== CLASS FUNCTIONS ==========

/**
 * @function getClasses
 * @description Retrieve all classes with their associated teachers and subjects
 */
export const getClasses = async (req, res) => {
  try {
    const classes = await classRepo.find({
      relations: ["teacher", "subject"],
      order: {
        classId: "ASC",
      },
    });

    return res.json({
      code: 200,
      data: classes,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const createClasses = async (req, res) => {
  try {
    const { teacherId, subjectId, grade, scheduleDay, scheduleTime } = req.body;

    if (!teacherId || (!subjectId && !grade) || !scheduleDay || !scheduleTime) {
      return res.json({
        code: 403,
        message: "All fields should be complete",
      });
    }

    const validTeacherId = await teacherRepo.find({
      where: {
        teacherId: teacherId,
      },
    });

    // console.log(validTeacherId);

    if (!validTeacherId || validTeacherId.length == 0) {
      return res.json({
        code: 404,
        message: "No teacher found for this teacher ID",
      });
    }

    let finalSubjectId = subjectId;

    if (!finalSubjectId && grade) {
       const teacherInfo = validTeacherId[0];
       if (!teacherInfo.specialization) {
           return res.json({
               code: 400,
               message: "Teacher does not have a set specialization. Admin must assign one."
           });
       }

       const expectedSubjectName = `${teacherInfo.specialization} (Grade ${grade})`;
       const subjectLookup = await subjectRepo.findOne({
           where: { subjectName: expectedSubjectName }
       });

       if (!subjectLookup) {
           return res.json({
               code: 404,
               message: `Subject '${expectedSubjectName}' does not exist.`
           });
       }

       finalSubjectId = subjectLookup.subjectId;
    }

    const validSubjectId = await subjectRepo.find({
      where: {
        subjectId: finalSubjectId,
      },
    });

    if (!validSubjectId || validSubjectId.length == 0) {
      return res.json({
        code: 404,
        message: "No subject found",
      });
    }

    const newClass = await classRepo.create({
      teacherId: teacherId,
      subjectId: finalSubjectId,
      scheduleDay: scheduleDay,
      scheduleTime: scheduleTime,
    });

    const overlap = await checkClassOverlapForTeacher(
      teacherId,
      scheduleDay,
      scheduleTime,
    );

    console.log("*****", overlap);

    if (overlap) {
      return res.json({
        code: 403,
        message: "Teacher already has a class at this time",
      });
    }

    await classRepo.save(newClass);

    // console.log(newClass);

    return res.json({
      code: 200,
      message: "New class created",
      data: newClass,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const checkClassOverlapForTeacher = async (
  teacherId,
  scheduleDay,
  scheduleTime,
  res,
) => {
  console.log("--------", scheduleTime);
  try {
    const classes = await classRepo.find({
      where: {
        teacherId: teacherId,
      },
      order: {
        classId: "ASC",
      },
    });

    console.log(classes);

    const previousTimeSlots = await classRepo.find({
      where: {
        teacherId: teacherId,
        scheduleDay: scheduleDay,
      },
      select: {
        scheduleTime,
      },
    });

    console.log("___________________", previousTimeSlots);

    if (previousTimeSlots.length > 0) {
      for (let time of previousTimeSlots) {
        console.log("-----", time.scheduleTime);
        console.log("-----", scheduleTime);
        if (scheduleTime === time.scheduleTime) {
            console.log("equal")
          return true;
        } else {
          return false;
        }
      }
      // if(scheduleTime === previousTimeSlots)
    }
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId, subjectId, scheduleDay, scheduleTime, isDeleted } = req.body;

    const classInstance = await classRepo.findOne({ where: { classId: parseInt(id) } });

    if (!classInstance) {
      return res.status(404).json({ code: 404, message: "Class not found" });
    }

    if (teacherId !== undefined) classInstance.teacherId = teacherId;
    if (subjectId !== undefined) classInstance.subjectId = subjectId;
    if (scheduleDay !== undefined) classInstance.scheduleDay = scheduleDay;
    if (scheduleTime !== undefined) classInstance.scheduleTime = scheduleTime;
    if (isDeleted !== undefined) classInstance.isDeleted = isDeleted;

    await classRepo.save(classInstance);

    return res.status(200).json({ code: 200, message: "Class updated successfully", data: classInstance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete
    const classInstance = await classRepo.findOne({ where: { classId: parseInt(id) } });

    if (!classInstance) {
      return res.status(404).json({ code: 404, message: "Class not found" });
    }

    classInstance.isDeleted = true;
    await classRepo.save(classInstance);

    return res.status(200).json({ code: 200, message: "Class deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "Internal server error" });
  }
};
