import { myDataSource } from "../config/db.js";

const classRepo = myDataSource.getRepository("Class");
const teacherRepo = myDataSource.getRepository("Teacher");
const subjectRepo = myDataSource.getRepository("Subject");

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
    const { teacherId, scheduleDay, scheduleTime } = req.body;

    if (!teacherId || !scheduleDay || !scheduleTime) {
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

    const teacher = await teacherRepo.find({
      where: {
        teacherId: teacherId,
      },
    });

    const subject = teacher[0].specialization;

    const subjectID = await subjectRepo.find({
      where: {
        subjectName: subject,
      },
    });

    const newClass = await classRepo.create({
      teacherId: teacherId,
      subjectId: subjectID[0].subjectId,
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

export const updateClass = () => {};
