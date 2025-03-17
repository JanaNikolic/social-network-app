import axios from "axios";
import jwtUtils from "../utils/jwtUtils";
import axiosInstance from "../utils/axiosInterceptor";
import { MessageResponse } from "../interfaces/message.interface";
import { ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest } from "../interfaces/password.interfaces";
import { RegisterRequest, EditUserDataRequest, EditUserDataResponse, UserList, UserResponse, RegisterResponse } from "../interfaces/user.interfaces";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/users`;

const register = async (body: RegisterRequest): Promise<string> => {
  try {
    const response = await axios.post<RegisterResponse>(API_URL, body);
    if (response.status === 201) return "Registered successfuly";
    else return "An error occurred during registration";
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during registration"
      );
    throw new Error(error.message || "An error occurred during registration");
  }
};

const forgotPassword = async (body: ForgotPasswordRequest): Promise<MessageResponse> => {
  try {
    const response = await axios.post<MessageResponse>(
      `${process.env.REACT_APP_BASE_API_URL}/reset-password`,
      body
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during password reset"
      );
    throw new Error(error.message || "An error occurred during password reset");
  }
};

const resetPassword = async (body: ResetPasswordRequest): Promise<MessageResponse> => {
  try {
    const response = await axios.put<MessageResponse>(
      `${process.env.REACT_APP_BASE_API_URL}/reset-password`,
      body
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "An error occurred during password reset"
      );
    throw new Error(error.message || "An error occurred during password reset");
  }
};

export const fetchUserData = async (): Promise<UserResponse> => {
  try {
    const token = jwtUtils.getToken();

    const userId = jwtUtils.getIdFromToken();

    const response = await axiosInstance.get<UserResponse>(
      `${API_URL}/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user data";
    throw new Error(errorMessage);
  }
};

export const fetchProfilePicture = async (userId: string): Promise<string> => {
  try {
    const token = jwtUtils.getToken();

    const response = await axiosInstance.get<Blob>(
      `${API_URL}/${userId}/profile-pictures`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    return URL.createObjectURL(response.data);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to fetch profile picture";
    throw new Error(errorMessage);
  }
};

const editProfilePicture = async (formData: FormData): Promise<MessageResponse> => {
  try {
    const token = jwtUtils.getToken();
    const response = await axiosInstance.put<MessageResponse>(
      `${API_URL}/profile-pictures`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to change profile picture"
      );
    throw new Error(error.message || "Failed to change profile picture");
  }
};

const editUserInfo = async (body: EditUserDataRequest): Promise<EditUserDataResponse> => {
  try {
    const token = jwtUtils.getToken();
    const response = await axiosInstance.put<EditUserDataResponse>(API_URL, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "An error occurred");
    throw new Error(error.message || "An error occurred");
  }
};

const changePassword = async (body: ChangePasswordRequest): Promise<MessageResponse> => {
  try {
    const token = jwtUtils.getToken();
    const response = await axiosInstance.put<MessageResponse>(`${API_URL}/passwords`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message ||
          "An error occurred during password change"
      );
    throw new Error(
      error.message || "An error occurred during password change"
    );
  }
};

const fetchUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const token = jwtUtils.getToken();
    const userResponse = await axiosInstance.get<UserResponse>(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return userResponse.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch user data"
      );
    throw new Error(error.message || "Failed to fetch user data");
  }
};

const searchUsers = async (searchQuery: string, page: number, size: number): Promise<UserList> => {
  try {
    const token = jwtUtils.getToken();
    const userResponse = await axiosInstance.get<UserList>(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: page,
        size: size,
        name: searchQuery,
      },
    });
    return userResponse.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to search users");
    throw new Error(error.message || "Failed to search users");
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
  fetchUserById,
  searchUsers,
};

export default userService;
