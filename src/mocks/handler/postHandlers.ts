import { http } from 'msw';

export const postHandlers = [
  http.get('/api/posts', async () => {
    return new Response(
      JSON.stringify([
        { id: 1, title: 'First Post' }, 
        { id: 2, title: 'Second Post' }
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
