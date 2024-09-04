import axiosInstance from "../utils/axiosInterceptor";

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/posts`;


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
    const response = await axiosInstance.put(
      `${API_URL}/${postId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
    throw new Error(error.message || "Failed to fetch user's posts");
  }
};

const fetchPostsComments = async (postId, page = 0, size = 10) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch post's comments"
      );
    throw new Error(error.message || "Failed to fetch post's comments");
  }
};

const postComment = async (content, postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post(
      `${API_URL}/${postId}/comments`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 201) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to post comment");
    throw new Error(error.message || "Failed to post comment");
  }
};

const editComment = async (content, postId, commentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(
      `${API_URL}/${postId}/comments/${commentId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to edit comment");
    throw new Error(error.message || "Failed to edit comment");
  }
};

const deleteComment = async (postId, commentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete(
      `${API_URL}/${postId}/comments/${commentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to delete comment");
    throw new Error(error.message || "Failed to delete comment");
  }
};

const fetchPostById = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`${API_URL}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch post"
      );
    throw new Error(error.message || "Failed to fetch post");
  }
};

const postService = {
  addPost,
  likePost,
  dislikePost,
  editPost,
  fetchPostsForUser,
  fetchPostsComments,
  postComment,
  editComment,
  deleteComment,
  fetchPostById
};
export default postService;
