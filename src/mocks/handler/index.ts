import { signUpHandlers } from './signUpHandlers';
import { postHandlers } from './postHandlers';
import { userHandlers } from './userHandlers';
import { loginHandlers } from './loginHandlers';
import { intermediateHandlers } from './IntermediateHandlers';
import { loginUserHandlers } from './loginUserHandlers';
import { findIdHandlers } from './findIdHandlers';
import { advancedGameHandlers } from './advancedHandlers';
import { beginUserHandlers } from './beginnerHandlers';
import { flipCardGameHandlers } from './flipCardGameHandlers';
import { searchHandlers } from './searchHandlers';

export const handlers = [
  ...signUpHandlers,
  ...postHandlers,
  ...userHandlers,
  ...loginHandlers,
  ...intermediateHandlers,
  ...loginUserHandlers,
  ...findIdHandlers,
  ...flipCardGameHandlers,
  ...advancedGameHandlers,
  ...beginUserHandlers,
  ...searchHandlers,
];
