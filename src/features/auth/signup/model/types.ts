export interface JoinRequest {
  loginId: string;
  pw: string;
  username: string;
  email: string;
  birth: number;
}

export interface JoinResponse {
  userId: string;
  username: string;
  email: string;
}
