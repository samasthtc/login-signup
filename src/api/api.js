import apiRequest from "./apiRequest";

export const login = (userData) =>
  apiRequest("/api/auth/login", "POST", {}, userData);

export const register = (userData) =>
  apiRequest("/api/auth/register", "POST", {}, userData);

export const getUsers = (token) =>
  apiRequest("/api/protected/", "GET", {
    Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
  });

export const deleteUser = (id, user, token) =>
  apiRequest(
    `/api/protected/delete/${id}`,
    "DELETE",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    user
  );

export const saveProfile = (id, changedData, token) =>
  apiRequest(
    `/api/protected/profile/${id}`,
    "PUT",
    {
      Authorization: `Bearer ${token ? token : localStorage.getItem("token")}`,
    },
    changedData
  );
