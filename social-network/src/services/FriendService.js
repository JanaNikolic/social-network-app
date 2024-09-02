import axiosInstance from "../utils/axiosInterceptor";

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/friends`;

const acceptFriendRequest = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    await axiosInstance.put(
      `${API_URL}/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to accept friend request"
      );
    throw new Error(error.message || "Failed to accept friend request");
  }
};

const rejectFriendRequest = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    await axiosInstance.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to delete friend request"
      );
    throw new Error(error.message || "Failed to delete friend request");
  }
};

const sendFriendRequest = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    await axiosInstance.post(
      `${API_URL}/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to send friend request"
      );
    throw new Error(error.message || "Failed to send friend request");
  }
};

export default {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
};
