import mongoose from "mongoose";

const driveSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: String,
    package: Number,
    location: String,
    requiredSkills: [
      { type: String, lowercase: true, trim: true }
    ],
    eligibility: {
      minCgpa: { type: Number, default: 0 },
      allowedBranches: [String],
      maxBacklogs: { type: Number, default: 0 },
    },
    deadline: Date,
    driveDate: Date,
    applyLink: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Drive", driveSchema);