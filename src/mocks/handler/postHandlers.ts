import { rest } from 'msw';

export const postHandlers = [
  rest.get('/api/posts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, title: 'First Post' }, { id: 2, title: 'Second Post' }])
    );
  }),
];
