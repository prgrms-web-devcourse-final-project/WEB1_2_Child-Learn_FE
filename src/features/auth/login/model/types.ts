export interface User {
  id: number;
  loginId: string;
  username: string;
  birth: string;
}

export interface LoginRequest {
  loginId: string;
  pw: string;
}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  user: User; // User 타입 사용
}
