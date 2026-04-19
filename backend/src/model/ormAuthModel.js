/**
 * ========== USER AUTHENTICATION MODEL ==========
 * File: backend/src/model/ormAuthModel.js
 * Purpose: TypeORM schema for User entity (central auth table)
 * 
 * @section Schema Definition
 */
import { EntitySchema } from "typeorm";
import { UserType } from "../utils/enum.js";

// ========== USER ENTITY SCHEMA ==========
export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    firstName: { type: "varchar", nullable: false },
    lastName: { type: "varchar", nullable: false },
    email: { type: "varchar", nullable: false, unique: true },
    password: { type: "varchar", nullable: false },
    isDeleted: {type: "boolean", nullable: false, default: false},
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
    otp: {
      type: "varchar",
      nullable: true,
    },
    otpExpires: {
      type: "datetime",
      nullable: true,
    },
    notifications: {
      type: "simple-json",
      nullable: true,
    },
    systemPreferences: {
      type: "simple-json",
      nullable: true,
    },
  },
  relations: {
    studentProfile: {
      type: "one-to-one",
      target: "Student",
      inverseSide: "user",
    },
    parentProfile: {
      type: "one-to-one",
      target: "Parent",
      inverseSide: "user",
    },
    teacherProfile: {
      type: "one-to-one",
      target: "Teacher",
      inverseSide: "user",
    },
  },
});