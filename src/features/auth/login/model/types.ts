export interface LoginRequest {
  loginId: string;
  pw: string;
}

export interface LoginResponse {
  id: number;
  loginId: string;
  username: string;
  birth: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
