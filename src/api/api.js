import apiRequest from "./apiRequest";

export const login = (userData) => apiRequest("/api/auth/login", "POST", userData);

export const register = (userData) => apiRequest("/api/auth/register", "POST", userData);

export const getUsers = () => apiRequest("/api/auth/");

export const deleteUser = (id) => apiRequest(`/api/auth/delete/${id}`, "DELETE");

export const saveProfile = (id, changedData) => apiRequest(`/api/auth/profile/${id}`, "PUT", changedData);

export const changePassword = (id, passwords) => apiRequest(`/api/auth/profile/password/${id}`, "PUT", passwords);
