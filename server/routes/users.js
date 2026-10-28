import express from "express";
import { updateProfile } from "../controllers/userController.js";
import { protect, studentOnly } from "../middleware/auth.js";

const router = express.Router();

router.put("/profile", protect, studentOnly, updateProfile);

export default router;