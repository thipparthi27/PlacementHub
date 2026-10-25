import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true
    },
    status: {
      type: String,
      enum: [
        "saved",
        "applied",
        "test",
        "interview",
        "selected",
        "rejected"
      ],
      default: "saved"
    },
    notes: String,
  },
  { timestamps: true }
);

applicationSchema.index(
  { user: 1, drive: 1 },
  { unique: true }
);

export default mongoose.model("Application", applicationSchema);