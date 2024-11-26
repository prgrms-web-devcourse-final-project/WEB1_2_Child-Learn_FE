import { http, HttpResponse, delay } from 'msw';
import { API_CONFIG } from '@/shared/config';
import { LoginRequest } from '@/features/auth/login/model/types';

export const loginHandlers = [
  http.post(`${API_CONFIG.baseURL}/member/login`, async ({ request }) => {
    // request.json()의 반환값에 타입 지정
    const { loginId, pw } = (await request.json()) as LoginRequest;

    await delay(500);

    if (loginId === 'test' && pw === 'test123') {
      return HttpResponse.json(
        {
          id: 1,
          loginId: 'test',
          username: '테스트계정',
          birth: '1998-03-24',
          accessToken: 'test_access_token_123',
          refreshToken: 'test_refresh_token_456',
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: '아이디 또는 비밀번호가 일치하지 않습니다.' },
      { status: 401 }
    );
  }),
];
