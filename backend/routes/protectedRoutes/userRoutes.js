import express from "express";
import {
  handleDeleteUser,
  handleGetUsers,
  handleUpdateUser,
} from "../../controllers/userController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/users", authMiddleware, handleGetUsers);
router.put("/users/:userId", authMiddleware, handleUpdateUser);
router.delete(
  "/users/:userId",
  authMiddleware,
  requireRole("admin"),
  handleDeleteUser
);

export default router;
