export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface SearchedUser {
  id: number;
  loginId: string;
  username: string;
  profileImage?: string;
  requestStatus?: RequestStatus; // 친구 요청 상태
  isFriend?: boolean; // 친구 여부
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
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
