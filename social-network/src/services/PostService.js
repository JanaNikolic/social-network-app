import axiosInstance from "../utils/axiosInterceptor";

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/posts`;

const fetchPostsForLogedInUser = async (page = 0, size = 2) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch user's posts"
      );
    throw new Error(error.message || "Failed to fetch user's posts'");
  }
};

const addPost = async (content) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post(
      `${API_URL}`,
      { content: content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 201) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to create post");
    throw new Error(error.message || "Failed to create post");
  }
};

const editPost = async (content, postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(`${API_URL}/${postId}`, {content}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to edit post");
    throw new Error(error.message || "Failed to edit post");
  }
};

const likePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post(
      `${API_URL}/${postId}/likes`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to like user's posts"
      );
    throw new Error(error.message || "Failed to like user's posts");
  }
};

const dislikePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete(`${API_URL}/${postId}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to dislike user's posts"
      );
    throw new Error(error.message || "Failed to dislike user's posts");
  }
};

const fetchPostsForUser = async (userId, page = 0, size = 10) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch user's posts"
      );
    throw new Error(error.message || "Failed to fetch user's posts'");
  }
};

const postService = {
  fetchPostsForLogedInUser,
  addPost,
  likePost,
  dislikePost,
  editPost,
  fetchPostsForUser,
};
export default postService;
