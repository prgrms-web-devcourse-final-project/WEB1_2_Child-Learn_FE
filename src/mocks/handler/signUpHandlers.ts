import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '@/shared/config';
import { JoinRequest, JoinResponse } from '@/features/auth/signup/model/types';

export const signUpHandlers = [
  http.post<never, JoinRequest>(
    `${API_CONFIG.baseURL}/member/join`, // BASE_URL을 API_CONFIG.baseURL로 변경
    async ({ request }) => {
      console.log('MSW intercepted request:', request.url);
      const data = await request.json();
      console.log('Request data:', data);

      // 유효성 검사
      if (
        !data.loginId ||
        !data.pw ||
        !data.username ||
        !data.email ||
        !data.birth
      ) {
        return HttpResponse.json(
          { message: '모든 필드를 입력해주세요.' },
          { status: 400 }
        );
      }

      // ID 중복 체크 모킹 (예시)
      if (data.loginId === 'existing') {
        return HttpResponse.json(
          { message: '이미 존재하는 아이디입니다.' },
          { status: 409 }
        );
      }

      return HttpResponse.json<JoinResponse>({
        userId: 'generated-id',
        username: data.username,
        email: data.email,
        birth: data.birth,
      });
    }
  ),
];
