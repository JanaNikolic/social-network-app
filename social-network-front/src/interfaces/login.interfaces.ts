interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export type { LoginRequest, LoginResponse };