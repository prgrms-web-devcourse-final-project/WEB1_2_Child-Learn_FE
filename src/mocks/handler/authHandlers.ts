import { rest } from 'msw';

export const authHandlers = [
  rest.post('/api/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Login successful', token: 'fake-jwt-token' })
    );
  }),
];
