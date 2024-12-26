import mongoose from "mongoose";
import {
  createPost,
  deletePostById,
  getAllPosts,
  getPostById,
  getPostsByQuery,
  getPostsByUser,
  likePost,
  updatePostById,
} from "../services/postService.js";

// Handle fetching all posts
export const handleGetAllPosts = async (req, res, next) => {
  const { page = 1, limit = 10, descending = true } = req.query;

  try {
    const posts = await getAllPosts(Number(page), Number(limit), descending);
    if (posts.length === 0) {
      return res
        .status(202)
        .json({ success: true, data: [], message: "No posts found" });
    } else {
      return res.status(200).json({
        success: true,
        data: posts,
        message: "Posts fetched successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Handle fetching a single post by ID
export const handleGetPostById = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      data: post,
      message: "Post fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Handle creating a new post
export const handleCreatePost = async (req, res, next) => {
  const { userId, username } = req;
  const postData = req.body;

  try {
    const newPost = await createPost({ userId, username, ...postData });
    res.status(201).json({
      success: true,
      data: newPost,
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Handle updating a post by ID
export const handleUpdatePostById = async (req, res, next) => {
  const { postId } = req.params;
  const updatedPostData = req.body;

  //post cant be empty
  if (!updatedPostData) {
    return res.status(400).json({
      success: false,
      message: "Post cannot be empty!",
    });
  }

  try {
    const updatedPost = await updatePostById(postId, updatedPostData);
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Handle deleting a post by ID
export const handleDeletePostById = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const deletedPost = await deletePostById(postId);
    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Handle fetching posts by user
export const handleGetPostsByUser = async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, descending = true } = req.query;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  try {
    const posts = await getPostsByUser(
      userId,
      Number(page),
      Number(limit),
      descending
    );

    if (posts.length === 0) {
      return res
        .status(202)
        .json({ success: true, data: [], message: "No posts found" });
    } else {
      return res.status(200).json({
        success: true,
        data: posts,
        message: "Posts fetched successfully",
      });
    }
  } catch (error) {
    if (
      error.message.includes("Cast to ObjectId failed") ||
      error.message.includes("No matching user")
    ) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next(error);
  }
};

// Handle fetching posts by search query
export const handleGetPostsByQuery = async (req, res, next) => {
  const { query, page = 1, limit = 10, descending = true } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const posts = await getPostsByQuery(
      query,
      Number(page),
      Number(limit),
      descending
    );
    if (posts.length === 0) {
      return res
        .status(202)
        .json({ success: true, data: [], message: "No posts found" });
    } else {
      return res.status(200).json({
        success: true,
        data: posts,
        message: "Posts fetched successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// handle liking a post
export const handleLikePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId, like } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  try {
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const returnedPost = await likePost(postId, userId, like);
    res.status(201).json({
      success: true,
      data: returnedPost,
      message: "Post liked successfully",
    });
  } catch (error) {
    if (
      error.message.includes("Cast to ObjectId failed") ||
      error.message.includes("No matching user")
    ) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next(error);
  }
};
