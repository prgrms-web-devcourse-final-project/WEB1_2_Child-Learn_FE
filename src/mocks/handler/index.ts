import { authHandlers } from './authHandlers';
import { postHandlers } from './postHandlers';
import { userHandlers } from './userHandlers';

export const handlers = [...authHandlers, ...postHandlers, ...userHandlers];