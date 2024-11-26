
import { authHandlers } from '../mocks/handler/authHandlers';
import { intermediateHandlers } from '../mocks/handler/IntermediateHandlers'


export const handlers = [
    ...authHandlers,
    ...intermediateHandlers,
    // ... 다른 핸들러들
];