import { EntitySchema } from "typeorm";
import { UserType } from "../utils/enum.js";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    firstName: { type: "varchar", nullable: false },
    lastName: { type: "varchar", nullable: false },
    email: { type: "varchar", nullable: false, unique: true },
    password: { type: "varchar", nullable: false },
    userType: {
      type: "enum",
      enum: Object.values(UserType),
      nullable: false,
      default: UserType.STUDENT,
    },
    createdAt: {
      type: "datetime",
      createDate: true,
      nullable: false,
    },
    updatedAt: {
      type: "datetime",
      updateDate: true,
      nullable: false,
    },
  },
});
