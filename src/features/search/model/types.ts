export interface SearchedUser {
  id: number;
  loginId: string;
  username: string;
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
