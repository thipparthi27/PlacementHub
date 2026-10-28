import express from "express";

import {
  getMyApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

import { protect, studentOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, studentOnly);

router.get("/", getMyApplications);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;