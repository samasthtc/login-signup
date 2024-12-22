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
    res.status(200).json({
      success: true,
      data: posts,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Handle fetching a single post by ID
export const handleGetPostById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await getPostById(id);
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
  const postData = req.body;

  try {
    const newPost = await createPost(postData);
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
  const { id } = req.params;
  const updatedPostData = req.body;

  try {
    const updatedPost = await updatePostById(id, updatedPostData);
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
  const { id } = req.params;

  try {
    const deletedPost = await deletePostById(id);
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

  try {
    const posts = await getPostsByUser(
      userId,
      Number(page),
      Number(limit),
      descending
    );
    res.status(200).json({
      success: true,
      data: posts,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Handle fetching posts by search query
export const handleGetPostsByQuery = async (req, res, next) => {
  const { query } = req.query;
  const { page = 1, limit = 10, descending = true } = req.query;

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
    res.status(200).json({
      success: true,
      data: posts,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// handle liking a post
export const handleLikePost = async (req, res, next) => {
  const { id } = req.params;
  const { userId, like } = req.body;

  try {
    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const response = await likePost(id, userId, like);
    res.status(200).json({
      success: true,
      data: response,
      message: "Post liked successfully",
    });
  } catch (error) {
    next(error);
  }
};
