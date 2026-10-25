import express from "express";
import {
  getDrives,
  getDrive,
  createDrive,
  updateDrive,
  deleteDrive,
} from "../controllers/driveController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // every drive route needs a login

router.get("/", getDrives);
router.get("/:id", getDrive);
router.post("/", adminOnly, createDrive);
router.put("/:id", adminOnly, updateDrive);
router.delete("/:id", adminOnly, deleteDrive);

export default router;