import express from "express";
import {
  handleCreatePost,
  handleDeletePostById,
  handleGetAllPosts,
  handleGetPostById,
  handleGetPostsByQuery,
  handleGetPostsByUser,
  handleUpdatePostById,
} from "../../controllers/postController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, handleGetAllPosts);
router.get("/:id", authMiddleware, handleGetPostById);
router.post("/", authMiddleware, handleCreatePost);
router.put("/:id", authMiddleware, handleUpdatePostById);
router.delete("/:id", authMiddleware, handleDeletePostById);
router.get("/user/:userId", authMiddleware, handleGetPostsByUser);
router.get("/search", authMiddleware, handleGetPostsByQuery);

export default router;
