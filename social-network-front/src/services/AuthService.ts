import axios from "axios";
import { LoginRequest, LoginResponse } from "../interfaces/login.interfaces";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/auth`;

const login = async (body: LoginRequest): Promise<void> => {
  try {
    const response = await axios.post<LoginResponse>(API_URL, body);
    localStorage.setItem("token", response.data.token);
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "An error occurred during login"
      );
    }
    throw new Error(error.message || "An error occurred during login");
  }
};

const authService = {
  login,
};

export default authService;