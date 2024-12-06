import { signUpHandlers } from './signUpHandlers';
import { postHandlers } from './postHandlers';
import { userHandlers } from './userHandlers';
import { loginHandlers } from './loginHandlers';
import { intermediateHandlers } from './IntermediateHandlers';
import { loginUserHandlers } from './loginUserHandlers';
import { findIdHandlers } from './findIdHandlers';
import { advancedGameHandlers } from './advancedHandlers';
import { beginUserHandlers } from './beginnerHandlers';
import { walletHandlers } from './walletHandlers'
import { flipCardGameHandlers } from './flipCardGameHandlers';
import { wordQuizGameHandlers } from './wordQuizGameHandler';
import { searchHandlers } from './searchHandlers';
import { avatarHandlers } from './avatarHandlers';

export const handlers = [
  ...signUpHandlers,
  ...postHandlers,
  ...userHandlers,
  ...loginHandlers,
  ...intermediateHandlers,
  ...loginUserHandlers,
  ...findIdHandlers,
  ...flipCardGameHandlers,
  ...wordQuizGameHandlers,
  ...advancedGameHandlers,
  ...beginUserHandlers,
  ...searchHandlers,
  ...walletHandlers,
  ...avatarHandlers
];
