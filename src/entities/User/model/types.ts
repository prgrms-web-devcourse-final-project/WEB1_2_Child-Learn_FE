export interface User {
  id: number;
  loginId: string;
  username: string;
  birth: string;
}

export interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserInfo {
  id: number;
  loginId: string;
  email: string;
  username: string;
  birth: string;
  currentPoints: number;
  currentCoins: number;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}
