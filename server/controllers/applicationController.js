import Application from "../models/Application.js";
import Drive from "../models/Drive.js";

const STATUSES = ["saved", "applied", "test", "interview", "selected", "rejected"];

const deadlinePassed = (drive) =>
  drive && drive.deadline && new Date(drive.deadline) < new Date();

// GET /api/applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate("drive")
      .sort({ updatedAt: -1 });
    // skip applications whose drive was deleted
    res.json(applications.filter((a) => a.drive));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/applications   body: { driveId, status? }
export const createApplication = async (req, res) => {
  try {
    const { driveId, status = "saved" } = req.body;

    if (!driveId) {
      return res.status(400).json({ message: "driveId is required" });
    }
    if (!["saved", "applied"].includes(status)) {
      return res
        .status(400)
        .json({ message: "A new application can only start as saved or applied" });
    }

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    if (status === "applied" && deadlinePassed(drive)) {
      return res.status(400).json({ message: "The deadline for this drive has passed" });
    }

    const existing = await Application.findOne({ user: req.user._id, drive: driveId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You already have an application for this drive", application: existing });
    }

    const application = await Application.create({
      user: req.user._id,
      drive: driveId,
      status,
    });
    res.status(201).json(application);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Drive not found" });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already have an application for this drive" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/applications/:id   body: { status?, notes? }
export const updateApplication = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id, // a student can only edit their own
    }).populate("drive");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      if (
        status === "applied" &&
        application.status === "saved" &&
        deadlinePassed(application.drive)
      ) {
        return res.status(400).json({ message: "The deadline for this drive has passed" });
      }
      application.status = status;
    }

    if (notes !== undefined) application.notes = String(notes).slice(0, 500);

    await application.save();
    res.json(application);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application removed" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};