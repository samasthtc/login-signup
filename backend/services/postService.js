import Post from "../models/Post.js";

// fetch all posts with pagination and sorting
export const getAllPosts = async (page = 1, limit = 10, descending = true) => {
  const skip = (page - 1) * limit;
  const order = descending ? -1 : 1;

  return await Post.find()
    .sort({ createdAt: order })
    .skip(skip)
    .limit(limit)
    .lean();
};

// fetch a single post by its id
export const getPostById = async (postId) => {
  return await Post.findById(postId);
};

// create a new post
export const createPost = async (postData) => {
  const post = new Post(postData);
  return await post.save();
};

// update a post by id
export const updatePostById = async (postId, updatedPostData) => {
  return await Post.findByIdAndUpdate(postId, updatedPostData, {
    new: true,
  });
};

// delete a post by id
export const deletePostById = async (postId) => {
  return await Post.findByIdAndDelete(postId);
};

// fetch posts by a specific user with pagination and sorting
export const getPostsByUser = async (
  userId,
  page = 1,
  limit = 10,
  descending = true
) => {
  const skip = (page - 1) * limit;
  const order = descending ? -1 : 1;

  return await Post.find({ userId: userId })
    .sort({ createdAt: order })
    .skip(skip)
    .limit(limit)
    .lean();
};

// fetch posts by a search query with pagination and sorting
export const getPostsByQuery = async (
  query,
  page = 1,
  limit = 10,
  descending = true
) => {
  const skip = (page - 1) * limit;
  const order = descending ? -1 : 1;

  return await Post.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { body: { $regex: query, $options: "i" } },
    ],
  })
    .sort({ createdAt: order })
    .skip(skip)
    .limit(limit)
    .lean();
};

// like or unlike a post
export const likePost = async (postId, userId, like = true) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (like === true || like === "true") {
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    }
  } else {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  }

  return await post.save();
};
