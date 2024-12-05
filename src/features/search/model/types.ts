export type FriendshipStatus = 'FRIEND' | 'PENDING' | 'NOT_FRIEND';

export interface SearchedUser {
  id: number;
  loginId: string;
  username: string;
  profileImage?: string;
  friendshipStatus: FriendshipStatus;
}

export interface UserSearchResponse {
  content: SearchedUser[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number; // 추가
    paged: boolean; // 추가
    unpaged: boolean; // 추가
  };
  totalElements: number;
  totalPages: number;
  size: number; // 추가
  number: number; // 추가
  sort: {
    // 추가
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number; // 추가
  last: boolean;
  first: boolean;
  empty: boolean;
}
