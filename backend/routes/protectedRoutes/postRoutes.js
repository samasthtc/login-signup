import express from "express";
import {
  handleCreatePost,
  handleDeletePostById,
  handleGetAllPosts,
  handleGetPostById,
  handleGetPostsByQuery,
  handleGetPostsByUser,
  handleLikePost,
  handleUpdatePostById,
} from "../../controllers/postController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management and retrieval
 */

const router = express.Router();

router.get("/user/:userId", authMiddleware, handleGetPostsByUser);
router.get("/search", authMiddleware, handleGetPostsByQuery);
router.get("/", authMiddleware, handleGetAllPosts);
router.post("/", authMiddleware, handleCreatePost);
router.get("/:postId", authMiddleware, handleGetPostById);
router.put("/:postId", authMiddleware, handleUpdatePostById);
router.delete("/:postId", authMiddleware, handleDeletePostById);
router.post("/:postId/like", authMiddleware, handleLikePost);

export default router;
