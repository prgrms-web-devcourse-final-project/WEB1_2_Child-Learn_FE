import { http } from 'msw';

const BASE_URL = '/api/v1';

interface FriendRequestResponse {
  status: 'ACCEPT' | 'REJECT';
}

let notifications = {
  content: [
    {
      notificationId: 1,
      senderLoginId: 123,
      senderUsername: '재령',
      title: '친구 요청',
      content: '친구 요청을 보냈습니다.',
      type: 'FRIEND_REQUEST',
      isRead: false,
      createdAt: '2024-03-07T10:00:00',
      profileImageUrl: null,
      elapsedTime: '방금',
    },
    {
      notificationId: 2,
      senderLoginId: 124,
      senderUsername: '은혁',
      title: '친구 요청',
      content: '친구 요청을 보냈습니다.',
      type: 'FRIEND_REQUEST',
      isRead: false,
      createdAt: '2024-03-07T09:40:00',
      profileImageUrl: null,
      elapsedTime: '20분 전',
    },
    {
      notificationId: 3,
      senderLoginId: 125,
      senderUsername: '찬식',
      title: '친구 수락',
      content: '친구 요청을 수락했습니다.',
      type: 'FRIEND_ACCEPT',
      isRead: false,
      createdAt: '2024-03-07T09:30:00',
      profileImageUrl: null,
      elapsedTime: '30분 전',
    },
  ],
  pageable: {
    last: true,
    number: 0,
    size: 20,
    numberOfElements: 3,
    first: true,
    empty: false,
  },
};

export const notificationHandlers = [
  http.get(`${BASE_URL}/notifications`, () => {
    return new Response(JSON.stringify(notifications), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.get(`${BASE_URL}/notifications/subscribe`, () => {
    return new Response(
      `data: {"event":"notification","id":"user123_1638245678901","data":"EventStream Created. [username=user123]"}`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }),

  http.patch(`${BASE_URL}/notifications/all/read`, () => {
    notifications.content = notifications.content.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    return new Response(
      JSON.stringify({ message: '모든 알림 읽음 처리 완료' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  http.delete(`${BASE_URL}/notifications/:notificationId`, ({ params }) => {
    const notificationId = Number(params.notificationId);

    notifications.content = notifications.content.filter(
      (notification) => notification.notificationId !== notificationId
    );

    notifications.pageable.numberOfElements = notifications.content.length;
    notifications.pageable.empty = notifications.content.length === 0;

    return new Response(JSON.stringify({ message: '알림 삭제 완료' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.post(
    `${BASE_URL}/friends/request/:requestId`,
    async ({ request, params }) => {
      const { status } = (await request.json()) as FriendRequestResponse;
      const requestId = Number(params.requestId);

      // notifications 상태 업데이트 - type은 변경하지 않고 status만 추가
      notifications.content = notifications.content.map((notification) =>
        notification.notificationId === requestId
          ? {
              ...notification,
              status: status, // 상태만 추가
              isRead: true,
            }
          : notification
      );

      return new Response(
        JSON.stringify({
          success: true,
          message:
            status === 'ACCEPT'
              ? '친구 요청을 수락했습니다.'
              : '친구 요청을 거절했습니다.',
          status: status,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  ),
];
