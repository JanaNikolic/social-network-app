export interface FriendsResponse {
  friends: Friend[];
}

export interface Friend {
  id: number;
  name: string;
  lastname: string;
  username: string;
  isFriend: boolean;
}
