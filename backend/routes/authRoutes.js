import express from "express";
import {
  handleDeleteUser,
  handleGetUsers,
  handleLogin,
  handleRegister,
  handleSaveProfile,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.put("/profile", handleSaveProfile);
router.delete("/delete", handleDeleteUser);
router.get("/", handleGetUsers);

export default router;
