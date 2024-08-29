import axios from "axios";

const API_URL = "http://localhost:9000/api/users";

const register = async (body) => {
  try {
    const response = await axios.post(API_URL, body);
    if (response.status === 201) return "Registered successfuly";
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during registration"
      );
    throw new Error(error.message || "An error occurred during registration");
  }
};

const resetPassword = async (body) => {
  try {
    const response = await axios.post(
      "http://localhost:9000/api/reset-password",
      body
    );
    if (response.status === 201) return "Reset password link sent";
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during password reset"
      );
    throw new Error(error.message || "An error occurred during password reset");
  }
};

const userService = {
  register,
  resetPassword,
};
export default userService;