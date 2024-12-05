import express from "express";
import {
  handleDeleteUser,
  handleGetUsers,
  handleLogin,
  handleRegister,
  handleSaveProfile,
  handleChangePassword
} from "../controllers/authController.js";
// import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.put("/profile/:id", handleSaveProfile);
router.put("/profile/password/:id", handleChangePassword);
router.delete("/delete/:id", handleDeleteUser);
router.get("/", handleGetUsers);

export default router;
