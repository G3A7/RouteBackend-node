import mongoose from "mongoose";
import { GENDER, ROLE } from "../utils/constant.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.male,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.user,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
