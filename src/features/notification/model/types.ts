export type NotificationType = 'MESSAGE' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT';
export type NotificationStatus = 'ACCEPTED' | 'REJECTED' | undefined;

export interface Notification {
  notificationId: number;
  senderLoginId: number;
  senderUsername: string;
  title: string;
  content: string;
  type: NotificationType;
  status?: NotificationStatus; // 추가
  isRead: boolean;
  createdAt: string;
  profileImageUrl: string | null;
  elapsedTime: string;
}

export interface NotificationResponse {
  content: Notification[];
  pageable: {
    last: boolean;
    number: number;
    size: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}
