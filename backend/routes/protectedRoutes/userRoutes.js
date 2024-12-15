import express from "express";
import {
  handleDeleteUser,
  handleGetUsers,
  handleSaveProfile,
} from "../../controllers/authController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.put("/:id", authMiddleware, handleSaveProfile);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  handleDeleteUser
);
router.get("/", authMiddleware, handleGetUsers);

export default router;
