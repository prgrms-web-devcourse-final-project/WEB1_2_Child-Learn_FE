export interface Friend {
  id: number;
  username: string;
  loginId: string;
  profileImage: string;
  active: boolean;
}

export type FriendRequestStatus = 'ACCEPT' | 'REJECT';
