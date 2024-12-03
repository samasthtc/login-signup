const BASE_URL = "http://localhost:5000";

export const login = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("Error:", errorData.message);
    throw new Error(errorData.message || "Failed to login");
  }

  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("Error:", errorData.message);
    throw new Error(errorData.message || "Failed to register");
  }
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/`);
  if (!response.ok) {
    const errorData = await response.json();
    console.log("Error:", errorData.message);
    throw new Error(errorData.message || "Failed to fetch users");
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${BASE_URL}/api/auth/delete/${Number(id)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.log("Error:", errorData.message);
    throw new Error(errorData.message || "Failed to delete user");
  }
  return response.json();
};

export const saveProfile = async (id, changedData) => {
  const response = await fetch(`${BASE_URL}/api/auth/profile/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changedData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.log("Error:", errorData.message);
    throw new Error(errorData.message || "Failed to update profile");
  }
  return response.json();
};
