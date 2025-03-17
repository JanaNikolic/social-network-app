import { UserResponse } from "./user.interfaces";

export interface PostsResponse {
  posts: PostResponse[];
}

export interface PostResponse {
  id: number;
  postedBy: UserResponse;
  createdAt: string;
  content: string;
  isLiked: boolean;
  numOfLikes: number;
  numOfComments: number;
}

export interface PostRequest {
  id: number;
  postedBy: UserResponse;
  createdAt: string;
  content: string;
  isLiked: boolean;
  numOfLikes: number;
  numOfComments: number;
}

export interface UpsertPostResponse {
  id: number;
  content: string;
  postedBy: number;
  createdAt: string;
}
