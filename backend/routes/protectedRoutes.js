import express from "express";
import {
  handleDeleteUser,
  handleGetUsers,
  handleSaveProfile,
} from "../controllers/authController.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile/:id", authMiddleware, handleSaveProfile);
router.delete("/delete/:id", authMiddleware, requireRole("admin"), handleDeleteUser);
router.get("/users", authMiddleware, handleGetUsers);

export default router;
