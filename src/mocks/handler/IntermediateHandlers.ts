import { http } from 'msw';

export const authHandlers = [
  http.post('/api/v1/auth/login', async () => {
    return new Response(
      JSON.stringify({ message: 'Intermediate_chat', token: 'fake-jwt-token' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),
];
