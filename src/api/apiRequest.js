import axios from "axios";

const BASE_URL = "http://localhost:5000";

const apiRequest = async (
  endpoint,
  method = "GET",
  headers = {},
  body = null
) => {
  try {
    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      data: body,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
export default apiRequest;
