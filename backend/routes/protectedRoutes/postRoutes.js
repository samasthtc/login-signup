import express from "express";
import {
  handleCreatePost,
  handleDeletePostById,
  handleGetAllPosts,
  handleGetPostById,
  handleGetPostsByQuery,
  handleGetPostsByUser,
  handleUpdatePostById,
  handleLikePost
} from "../../controllers/postController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/:userId", authMiddleware, handleGetPostsByUser);
router.get("/search", authMiddleware, handleGetPostsByQuery);
router.get("/", authMiddleware, handleGetAllPosts);
router.post("/", authMiddleware, handleCreatePost);
router.get("/:id", authMiddleware, handleGetPostById);
router.put("/:id", authMiddleware, handleUpdatePostById);
router.delete("/:id", authMiddleware, handleDeletePostById);
router.post("/:id/like", authMiddleware, handleLikePost);

export default router;
