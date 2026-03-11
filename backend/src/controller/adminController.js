import { myDataSource } from "../config/db.js";
import { UserType } from "../utils/enum.js";
import { Not } from "typeorm";

const adminRepo = myDataSource.getRepository("User");

export const getAllUsers = async (req, res) => {
  const users = await adminRepo.find({
    where: {
        userType: Not("admin")
    },
    order: {
      id: "ASC",
    },
  });

  return res.json({
    code: 200,
    count: users.length,
    data: users,
  });
};
