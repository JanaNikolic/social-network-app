export interface UserList {
  users: UserResponse[];
}

export interface UserResponse {
  id: number;
  name: string;
  lastname: string;
  username: string;
  isFriend: boolean;
}

export interface UserWithPicture {
  id: number;
  name: string;
  lastname: string;
  username: string;
  isFriend: boolean;
  profilePicture: string;
}

export interface EditUserDataResponse {
  id: number;
  name: string;
  lastname: string;
  username: string;
}

export interface EditUserDataRequest {
  name: string;
  lastname: string;
  username: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  lastname: string;
  username: string;
}

export interface RegisterResponse {
  token: string;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
}