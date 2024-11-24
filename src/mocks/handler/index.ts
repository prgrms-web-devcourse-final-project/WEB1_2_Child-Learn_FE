import { signUpHandlers } from './signUpHandlers';
import { postHandlers } from './postHandlers';
import { userHandlers } from './userHandlers';

export const handlers = [...signUpHandlers, ...postHandlers, ...userHandlers];
