import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '@/shared/config';

export const loginUserHandlers = [
  http.get(`${API_CONFIG.baseURL}/member/my-info`, () => {
    return HttpResponse.json({
      id: 3,
      loginId: 'test2',
      email: 'test2@test2.com',
      username: 'hana',
      birth: '1998-03-24',
      points: 187400,
      createdAt: '2024-11-25T03:21:27.685497',
      updatedAt: '2024-11-25T04:01:31.934454',
    });
  }),
];
