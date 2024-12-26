import apiRequest from "./apiRequest";

/** authorization requests */
export const login = (userData) =>
  apiRequest("/api/auth/login", "POST", {}, userData);

export const register = (userData) =>
  apiRequest("/api/auth/register", "POST", {}, userData);

/** protected user requests */
export const getUsers = (token) =>
  apiRequest("/api/users/", "GET", {
    Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
  });

export const deleteUser = (userId, user, token) =>
  apiRequest(
    `/api/users/${userId}`,
    "DELETE",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    user
  );

export const updateUser = (userId, changedData, token) =>
  apiRequest(
    `/api/users/${userId}`,
    "PUT",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    changedData
  );

export const visitProfile = (token) =>
  apiRequest("/api/profile", "GET", {
    Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
  });

/** protected post requests */
export const createPost = (postData, token) =>
  apiRequest(
    "/api/posts/",
    "POST",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    postData
  );

export const getAllPosts = (options = {}, token) => {
  const queryParams = new URLSearchParams(options).toString();
  return apiRequest(`/api/posts?${queryParams}`, "GET", {
    Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
  });
};

export const getPostById = (postId, token) =>
  apiRequest(`/api/posts/${postId}`, "GET", {
    Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
  });

export const updatePost = (postId, changedData, token) =>
  apiRequest(
    `/api/posts/${postId}`,
    "PUT",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    changedData
  );

export const deletePost = (postId, token) =>
  apiRequest(
    `/api/posts/${postId}`,
    "DELETE",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    {}
  );

export const getPostsByUser = (userId, options = {}, token) => {
  const queryParams = new URLSearchParams(options).toString();
  apiRequest(
    `/api/posts/user/${userId}?${queryParams}`,
    "GET",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    {}
  );
};

export const getPostsByQuery = (query, options = {}, token) => {
  const queryParams = new URLSearchParams({ ...options, query }).toString();
  return apiRequest(`/api/posts/search?${queryParams}`, "GET", {
    Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
  });
};

export const likePost = (postId, userId, like, token) => {
  return apiRequest(
    `/api/posts/${postId}/like`,
    "POST",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    { userId, like }
  );
};
