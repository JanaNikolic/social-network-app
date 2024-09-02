import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/auth`;

const login = async (body) => {
  try {
    const response = await axios.post(API_URL, body);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during login"
      );
    throw new Error(error.message || "An error occurred during login");
  }
};

const authService = {
  login
};
export default authService;
