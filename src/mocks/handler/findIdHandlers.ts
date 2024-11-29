import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '@/shared/config';

export const findIdHandlers = [
  // findId 핸들러
  http.post(
    `${API_CONFIG.baseURL}${API_CONFIG.endpoints.findId}`,
    async ({ request }) => {
      const body = await request.json();
      const { email, birth } = body as { email: string; birth: string };

      // 예시: 특정 이메일과 생년월일에 대해 성공 응답
      if (email === 'test@example.com' && birth === '1999-04-17') {
        return HttpResponse.json({ loginId: 'maskedId123' }, { status: 200 });
      }

      // 일치하는 정보가 없는 경우
      return HttpResponse.json(
        { message: '일치하는 회원 정보가 없습니다.' },
        { status: 404 }
      );
    }
  ),

  // resetPassword 핸들러
  http.post(
    `${API_CONFIG.baseURL}${API_CONFIG.endpoints.resetPw}`,
    async ({ request }) => {
      const body = await request.json();
      const { loginId, email } = body as { loginId: string; email: string };

      // 예시: 특정 아이디와 이메일에 대해 성공 응답
      if (loginId === 'abc1234' && email === 'test@example.com') {
        return HttpResponse.json(
          { message: '임시 비밀번호가 이메일로 전송되었습니다.' },
          { status: 200 }
        );
      }

      // 실패 응답
      return HttpResponse.json(
        { message: '비밀번호 찾기에 실패했습니다.' },
        { status: 400 }
      );
    }
  ),
];
