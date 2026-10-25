import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    branch: { type: String, trim: true },
    cgpa: { type: Number, min: 0, max: 10 },
    backlogs: { type: Number, default: 0, min: 0 },
    skills: [{ type: String, lowercase: true, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);