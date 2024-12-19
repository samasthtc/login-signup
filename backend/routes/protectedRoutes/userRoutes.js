import express from "express";
import {
  handleDeleteUser,
  handleGetUsers,
  handleUpdateUser,
} from "../../controllers/authController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.put("/users/:id", authMiddleware, handleUpdateUser);
router.delete("/users/:id", authMiddleware, requireRole("admin"), handleDeleteUser);
router.get("/users", authMiddleware, handleGetUsers);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Profile visited" });
});


export default router;
