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
          id: 1,
          loginId: 'test',
          username: '테스트계정',
          birth: '1998-03-24',
          accessToken: 'test_access_token_123',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': [
              'refreshToken=test_refresh_token_456; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800', // 7일
              // 필요한 경우 추가 쿠키
            ].join(', '),
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
  http.post(`${API_CONFIG.baseURL}/member/refresh`, async ({ request }) => {
    // 쿠키 확인 로직 추가
    const cookies = request.headers.get('cookie');
    if (!cookies?.includes('refreshToken=')) {
      return new Response(
        JSON.stringify({
          message: 'Refresh token not found',
          error: 'INVALID_TOKEN',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await delay(100);

    return new Response(
      JSON.stringify({
        accessToken: `new_access_token_${Date.now()}`,
        user: {
          id: 1,
          loginId: 'test',
          username: '테스트계정',
          birth: '1998-03-24',
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': [
            `refreshToken=new_refresh_token_${Date.now()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
          ].join(', '),
        },
      }
    );
  }),
];
