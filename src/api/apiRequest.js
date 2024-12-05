const BASE_URL = "http://localhost:5000";

const apiRequest = async (endpoint, method = "GET", body = null) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error:", errorData.message);
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};
export default apiRequest;
