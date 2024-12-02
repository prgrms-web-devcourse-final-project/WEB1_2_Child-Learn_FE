import { http, HttpResponse } from 'msw';

interface FriendRequestBody {
  receiverId: string;
}

export const searchHandlers = [
  // 사용자 검색 핸들러
  http.get('/api/v1/member/search', ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');

    const mockUsers = [
      {
        id: 1,
        loginId: 'testuser456',
        username: '테스트유저2',
        profileImage: '/img/basic-profile.png',
      },
      {
        id: 2,
        loginId: 'testuser789',
        username: '테스트유저3',
        profileImage: '/img/basic-profile.png',
      },
      {
        id: 3,
        loginId: 'testuser123',
        username: '테스트유저1',
        profileImage: '/img/basic-profile.png',
      },
    ];

    const filteredUsers = username
      ? mockUsers.filter((user) => user.username.includes(username))
      : mockUsers;

    return HttpResponse.json({
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
    });
  }),

  // 친구 요청 핸들러
  http.post('/api/v1/friends/request', async ({ request }) => {
    const body = (await request.json()) as FriendRequestBody;

    return HttpResponse.json({
      message: `${body.receiverId}님에게 친구 요청을 보냈습니다.`,
    });
  }),
];
