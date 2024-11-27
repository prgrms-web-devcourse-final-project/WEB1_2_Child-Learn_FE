import { signUpHandlers } from './signUpHandlers';
import { postHandlers } from './postHandlers';
import { userHandlers } from './userHandlers';
import { loginHandlers } from './loginHandlers';
import { intermediateHandlers } from './IntermediateHandlers';
import { loginUserHandlers } from './loginUserHandlers';

export const handlers = [
  ...signUpHandlers,
  ...postHandlers,
  ...userHandlers,
  ...loginHandlers,
  ...intermediateHandlers,
  ...loginUserHandlers,
];
