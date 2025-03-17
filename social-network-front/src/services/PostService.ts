import { CommentsResponse, UpsertComment } from "../interfaces/comment.interfaces";
import { MessageResponse } from "../interfaces/message.interface";
import { UpsertPostResponse, PostsResponse, PostResponse } from "../interfaces/post.interfaces";
import axiosInstance from "../utils/axiosInterceptor";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}/posts`;

const addPost = async (content: string): Promise<UpsertPostResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post<UpsertPostResponse>(
      `${API_URL}`,
      { content: content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to create post");
    throw new Error(error.message || "Failed to create post");
  }
};

const editPost = async (content: string, postId: number): Promise<UpsertPostResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put<UpsertPostResponse>(
      `${API_URL}/${postId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to edit post");
    throw new Error(error.message || "Failed to edit post");
  }
};

const likePost = async (postId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post<MessageResponse>(
      `${API_URL}/${postId}/likes`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to like user's posts"
      );
    throw new Error(error.message || "Failed to like user's posts");
  }
};

const dislikePost = async (postId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete<MessageResponse>(`${API_URL}/${postId}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to dislike user's posts"
      );
    throw new Error(error.message || "Failed to dislike user's posts");
  }
};

const fetchPostsForUser = async (userId: number, page = 0, size = 10): Promise<PostsResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<PostsResponse>(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch user's posts"
      );
    throw new Error(error.message || "Failed to fetch user's posts");
  }
};

const fetchPostsComments = async (postId: number, page = 0, size = 10): Promise<CommentsResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<CommentsResponse>(`${API_URL}/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch post's comments"
      );
    throw new Error(error.message || "Failed to fetch post's comments");
  }
};

const postComment = async (content: string, postId: number): Promise<UpsertComment> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post<UpsertComment>(
      `${API_URL}/${postId}/comments`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to post comment");
    throw new Error(error.message || "Failed to post comment");
  }
};

const editComment = async (content: string, postId: number, commentId: number): Promise<UpsertComment> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put<UpsertComment>(
      `${API_URL}/${postId}/comments/${commentId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to edit comment");
    throw new Error(error.message || "Failed to edit comment");
  }
};

const deleteComment = async (postId: number, commentId: number): Promise<MessageResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete<MessageResponse>(
      `${API_URL}/${postId}/comments/${commentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data.message || "Failed to delete comment");
    throw new Error(error.message || "Failed to delete comment");
  }
};

const fetchPostById = async (postId: number): Promise<PostResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<PostResponse>(`${API_URL}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch post"
      );
    throw new Error(error.message || "Failed to fetch post");
  }
};

const fetchFriendsPosts = async (page = 0, size = 10): Promise<PostsResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<PostsResponse>(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(
        error.response.data.message || "Failed to fetch friend's posts"
      );
    throw new Error(error.message || "Failed to fetch friend's posts");
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
  fetchPostById,
  fetchFriendsPosts
};
export default postService;
