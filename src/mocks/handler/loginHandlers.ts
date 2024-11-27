import { http, delay } from 'msw';
import { API_CONFIG } from '@/shared/config';
import { LoginRequest } from '@/features/auth/login/model/types';

export const loginHandlers = [
  // 로그인 핸들러
  http.post(`${API_CONFIG.baseURL}/member/login`, async ({ request }) => {
    const { loginId, pw } = (await request.json()) as LoginRequest;

    await delay(500);

    if (loginId === 'test' && pw === 'test123') {
      return new Response(
        JSON.stringify({
          accessToken: 'mock_access_token_123',
          refreshToken: 'mock_refresh_token_123',
          user: {
            id: 3,
            loginId: 'test2',
            username: 'hana',
            email: 'test2@test2.com',
            birth: '1998-03-24',
            points: 1000,
            createdAt: '2024-11-25T03:21:27.685497',
            updatedAt: '2024-11-25T04:01:31.934454',
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: '로그인에 실패했습니다.',
        error: 'INVALID_CREDENTIALS',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 토큰 갱신 핸들러
  http.post(`${API_CONFIG.baseURL}/member/refresh`, async () => {
    await delay(100);

    // 개발 환경에서는 항상 새로운 토큰 발급
    return new Response(
      JSON.stringify({
        accessToken: 'new_mock_access_token_123',
        user: {
          id: 3,
          loginId: 'test2',
          username: 'hana',
          email: 'test2@test2.com',
          birth: '1998-03-24',
          points: 1000,
          createdAt: '2024-11-25T03:21:27.685497',
          updatedAt: '2024-11-25T04:01:31.934454',
        },
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
