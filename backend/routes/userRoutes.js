import express from "express";
import {
  handleDeleteUser,
  handleGetUsers,
  handleUpdateUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, handleGetUsers);
router.put("/:userId", authMiddleware, handleUpdateUser);
router.delete(
  "/:userId",
  authMiddleware,
  requireRole("admin"),
  handleDeleteUser
);

export default router;
