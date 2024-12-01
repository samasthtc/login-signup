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
router.put("/profile/:id", handleSaveProfile);
router.delete("/delete/:id", handleDeleteUser);
router.get("/", handleGetUsers);

export default router;
