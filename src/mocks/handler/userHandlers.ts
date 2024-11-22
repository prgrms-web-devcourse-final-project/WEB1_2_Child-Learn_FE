import { rest } from 'msw';

export const userHandlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }])
    );
  }),
];
