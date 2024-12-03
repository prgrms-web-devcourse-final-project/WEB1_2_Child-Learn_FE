import { http, delay } from 'msw';
import { API_CONFIG } from '@/shared/config';

interface FriendRequestBody {
  receiverId: string;
}

export const searchHandlers = [
  http.get(`${API_CONFIG.baseURL}/member/search`, async ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');

    await delay(300); // 실제 API 호출처럼 약간의 딜레이 추가

    const mockUsers = [
      {
        id: 1,
        loginId: 'testuser456',
        username: '테스트유저2',
        profileImage: '/img/basic-profile.png',
        requestStatus: undefined,
        isFriend: false,
      },
      {
        id: 2,
        loginId: 'testuser789',
        username: '테스트유저3',
        profileImage: '/img/basic-profile.png',
        requestStatus: 'PENDING',
        isFriend: false,
      },
      {
        id: 3,
        loginId: 'testuser123',
        username: '테스트유저1',
        profileImage: '/img/basic-profile.png',
        requestStatus: undefined,
        isFriend: true,
      },
    ];

    const filteredUsers = username
      ? mockUsers.filter(
          (user) =>
            user.username.includes(username) || user.loginId.includes(username)
        )
      : mockUsers;

    return new Response(
      JSON.stringify({
        content: filteredUsers,
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false,
          },
        },
        totalElements: filteredUsers.length,
        totalPages: 1,
        last: true,
        first: true,
        empty: filteredUsers.length === 0,
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
