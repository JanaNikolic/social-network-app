import axiosInstance from "../utils/axiosInterceptor";

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/friends`;

const acceptFriendRequest = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(
      `${API_URL}/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) return response.data;
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
    const response = await axiosInstance.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response.data;
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
    const response = await axiosInstance.post(
      `${API_URL}/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 201) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to send friend request"
      );
    throw new Error(error.message || "Failed to send friend request");
  }
};

const getFriends = async (page = 0, size = 5) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size },
      }
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to fetch friends");
    throw new Error(error.message || "Failed to fetch friends");
  }
};

const getFriendRequests = async (page = 0, size = 5) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}/requests`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size },
      }
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to fetch friend requests");
    throw new Error(error.message || "Failed to fetch friend requests");
  }
};

const getFriendRequestsByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}/requests/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) return response.data;
  } catch (error) {
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
