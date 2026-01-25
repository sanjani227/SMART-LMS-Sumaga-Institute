import { UserType } from "../utils/enum.js";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // id: {
    //     type: uuidv4(),

    // },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: mongoose.Schema.Types.String,
      default: UserType.STUDENT,
      required: true,
    },
  },

  { timestamps: true }
);

const User = mongoose.model("Sumaga-Users", userSchema);
export default User;
