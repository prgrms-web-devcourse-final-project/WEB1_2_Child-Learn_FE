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
