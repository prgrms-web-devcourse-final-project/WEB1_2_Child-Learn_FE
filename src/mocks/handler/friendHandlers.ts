import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '@/shared/config';

// 더미 데이터
const friendList = [
  {
    id: 1,
    username: '김철수',
    loginId: 'cheolsu',
    profileImage: null,
    active: true,
  },
  {
    id: 2,
    username: '이영희',
    loginId: 'younghee',
    profileImage: null,
    active: false,
  },
  {
    id: 3,
    username: '박지민',
    loginId: 'jimin',
    profileImage: null,
    active: true,
  },
  {
    id: 4,
    username: '정수연',
    loginId: 'suyeon',
    profileImage: null,
    active: false,
  },
  {
    id: 5,
    username: '강민수',
    loginId: 'minsu',
    profileImage: null,
    active: true,
  },
  {
    id: 6,
    username: '조은지',
    loginId: 'eunji',
    profileImage: null,
    active: true,
  },
  {
    id: 7,
    username: '윤서현',
    loginId: 'seohyun',
    profileImage: null,
    active: false,
  },
  {
    id: 8,
    username: '임재현',
    loginId: 'jaehyun',
    profileImage: null,
    active: true,
  },
  {
    id: 9,
    username: '한소희',
    loginId: 'sohee',
    profileImage: null,
    active: false,
  },
  {
    id: 10,
    username: '김도윤',
    loginId: 'doyun',
    profileImage: null,
    active: true,
  }
];

export const friendHandlers = [
    // 친구 목록 조회
    http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.friendList}`, ({ request }) => {
      console.log('MSW: Intercepted friend list request', request.url);
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '0');
      const size = parseInt(url.searchParams.get('size') || '8');
      const searchKeyword = url.searchParams.get('searchKeyword')?.toLowerCase();
  
      let filteredFriends = [...friendList];
      if (searchKeyword) {
        filteredFriends = filteredFriends.filter(
          friend =>
            friend.username.toLowerCase().includes(searchKeyword) ||
            friend.loginId.toLowerCase().includes(searchKeyword)
        );
      }
  
      const totalElements = filteredFriends.length;
      const totalPages = Math.ceil(totalElements / size);
      const start = page * size;
      const end = start + size;
      const paginatedFriends = filteredFriends.slice(start, end);
  
      console.log('MSW: Responding with', {
        content: paginatedFriends,
        totalElements,
        totalPages,
      });
  
      return HttpResponse.json({
        content: paginatedFriends,
        totalElements,
        totalPages,
        size,
        number: page,
        last: end >= totalElements,
        first: page === 0,
        empty: paginatedFriends.length === 0,
      });
    }),
  
    // 친구 삭제
    http.delete(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.friendRemove}/:friendId`, ({ params }) => {
      console.log('MSW: Intercepted friend delete request for ID:', params.friendId);
      const { friendId } = params;
      const index = friendList.findIndex(friend => friend.id === Number(friendId));
      
      if (index === -1) {
        return new HttpResponse(null, { status: 404 });
      }
  
      friendList.splice(index, 1);
      return new HttpResponse(null, { status: 200 });
    }),
  ];