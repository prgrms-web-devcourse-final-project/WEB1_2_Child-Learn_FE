export interface LoginRequest {
  loginId: string;
  pw: string;
}

export interface LoginResponse {
  jwt: string;
  memberId: number;
  username: string;
}
