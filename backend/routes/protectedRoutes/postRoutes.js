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

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", authMiddleware, handleGetAllPosts);

// /**
//  * @swagger
//  * /posts:
//  *  post:
//  *    summary: Create a new post
//  *    tags: [Posts]
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            type: object
//  *            properties:
//  *              body:
//  *                type: string
//  *                  description: Content of the post
//  *                    example: This is a new post
//  *                  required:
//  *            - body
//  * responses:
//  * 201:
//  * description: Post created successfully
//  * 400:
//  * description: Bad request
//  * 401:
//  * description: Unauthorized
//  * 403:
//  * description: Forbidden
//  * 500:
//  * description: Internal server error
//  *
//  */
router.post("/", authMiddleware, handleCreatePost);
router.get("/:id", authMiddleware, handleGetPostById);
router.put("/:id", authMiddleware, handleUpdatePostById);
router.delete("/:id", authMiddleware, handleDeletePostById);
router.post("/:id/like", authMiddleware, handleLikePost);

export default router;
