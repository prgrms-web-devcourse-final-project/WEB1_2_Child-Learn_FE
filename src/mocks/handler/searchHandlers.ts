import { http, delay } from 'msw';
import { API_CONFIG } from '@/shared/config';

interface FriendRequestBody {
  receiverId: string;
}

export const searchHandlers = [
  http.get(`${API_CONFIG.baseURL}/member/search`, async ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    const page = Number(url.searchParams.get('page')) || 0;
    const size = Number(url.searchParams.get('size')) || 10;

    await delay(300);

    // 더 많은 테스트 데이터
    const mockUsers = Array.from({ length: 70 }, (_, index) => ({
      id: index + 1,
      loginId: `testuser${index + 100}`,
      username: `테스트유저${index + 1}`,
      profileImage: '/img/basic-profile.png',
      requestStatus: index === 1 ? 'PENDING' : undefined,
      isFriend: index === 2,
    }));

    // 검색어로 필터링
    const filteredUsers = username
      ? mockUsers.filter(
          (user) =>
            user.username.includes(username) || user.loginId.includes(username)
        )
      : mockUsers;

    // 페이지네이션 적용
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return new Response(
      JSON.stringify({
        content: paginatedUsers,
        pageable: {
          pageNumber: page,
          pageSize: size,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false,
          },
          offset: page * size,
          paged: true,
          unpaged: false,
        },
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / size),
        size: size,
        number: page,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        numberOfElements: paginatedUsers.length,
        last: startIndex + size >= filteredUsers.length,
        first: page === 0,
        empty: paginatedUsers.length === 0,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  http.post(`${API_CONFIG.baseURL}/friends/request`, async ({ request }) => {
    const body = (await request.json()) as FriendRequestBody;

    await delay(300);

    return new Response(
      JSON.stringify({
        message: `${body.receiverId}님에게 친구 요청을 보냈습니다.`,
        requestStatus: 'PENDING',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),
];
