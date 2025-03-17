import { UserResponse } from "./user.interfaces";

export interface CommentsResponse {
  comments: Comment[];
}

export interface Comment {
  id: number;
  commentedBy: UserResponse;
  createdAt: string;
  content: string;
}

export interface CommentWithPhoto {
  id: number;
  commentedBy: UserResponse;
  createdAt: string;
  content: string;
  profilePhoto: string;
}

export interface UpsertComment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}
