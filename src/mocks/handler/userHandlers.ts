import { http } from 'msw';

export const userHandlers = [
  http.get('/api/users', async () => {
    return new Response(
      JSON.stringify([
        { id: 1, name: 'John Doe' }, 
        { id: 2, name: 'Jane Doe' }
      ]),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),
];
