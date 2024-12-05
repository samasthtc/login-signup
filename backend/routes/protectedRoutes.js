import express from "express";
import {
  // handleChangePassword,
  handleDeleteUser,
  handleGetUsers,
  handleSaveProfile,
} from "../controllers/authController.js";
// import { requireRole } from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile/:id", authMiddleware, handleSaveProfile);
// router.put("/profile/password/:id", authMiddleware, handleChangePassword);
router.delete("/delete/:id", authMiddleware, handleDeleteUser);
router.get("/", authMiddleware, handleGetUsers);

export default router;
