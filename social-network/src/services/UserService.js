import axios from "axios";
import jwtUtils from "../utils/jwtUtils";
import axiosInstance from "../utils/axiosInterceptor";

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/users`;

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

const forgotPassword = async (body) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_API_URL}/reset-password`,
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

const resetPassword = async (body) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_API_URL}/reset-password`,
      body
    );
    if (response.status === 201) return "Password reset successful";
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during password reset"
      );
    throw new Error(error.message || "An error occurred during password reset");
  }
};

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = jwtUtils.getIdFromToken();
    const userResponse = await axiosInstance.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (userResponse.status === 200) return userResponse.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch user data"
      );
    throw new Error(error.message || "Failed to fetch user data");
  }
};

const fetchProfilePicture = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const pictureResponse = await axiosInstance.get(
      `${API_URL}/${userId}/profile-pictures`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );
    const image = URL.createObjectURL(pictureResponse.data);
    return image;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch profile picture"
      );
    throw new Error(error.message || "Failed to fetch profile picture");
  }
};

const editProfilePicture = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(
      `${API_URL}/profile-pictures`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to change profile picture"
      );
    throw new Error(error.message || "Failed to change profile picture");
  }
};

const editUserInfo = async (body) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(API_URL, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred"
      );
    throw new Error(error.message || "An error occurred");
  }
};

const changePassword = async (body) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(`${API_URL}/passwords`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during password change"
      );
    throw new Error(error.message || "An error occurred during password change");
  }
};

const userService = {
  register,
  resetPassword,
  forgotPassword,
  fetchProfilePicture,
  fetchUserData,
  editProfilePicture,
  editUserInfo,
  changePassword,
};
export default userService;
