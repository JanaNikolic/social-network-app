import { FriendsResponse } from "../interfaces/friends.interfaces";
import { MessageResponse } from "../interfaces/message.interface";
import { RequestResponse } from "../interfaces/request.interfaces";
import axiosInstance from "../utils/axiosInterceptor";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/friends`;

const acceptFriendRequest = async (userId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put<MessageResponse>(
      `${API_URL}/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to accept friend request"
      );
    throw new Error(error.message || "Failed to accept friend request");
  }
};

const rejectFriendRequest = async (userId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete<MessageResponse>(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to delete friend request"
      );
    throw new Error(error.message || "Failed to delete friend request");
  }
};

const sendFriendRequest = async (userId: number): Promise<RequestResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post<RequestResponse>(
      `${API_URL}/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to send friend request"
      );
    throw new Error(error.message || "Failed to send friend request");
  }
};

const getFriends = async (page = 0, size = 5): Promise<FriendsResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to fetch friends");
    throw new Error(error.message || "Failed to fetch friends");
  }
};

const getFriendRequests = async (page = 0, size = 5): Promise<FriendsResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<FriendsResponse>(`${API_URL}/requests`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to fetch friend requests");
    throw new Error(error.message || "Failed to fetch friend requests");
  }
};

const getFriendRequestsByUserId = async (userId: number): Promise<RequestResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<RequestResponse>(`${API_URL}/requests/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to fetch friend request");
    throw new Error(error.message || "Failed to fetch friend request");
  }
};

const friendService = {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  getFriends,
  getFriendRequests,
  getFriendRequestsByUserId,
};
export default friendService;
