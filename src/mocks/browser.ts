import { setupWorker } from 'msw/browser';
import { handlers } from './handler/index';
import { intermediateHandlers } from './handler/IntermediateHandlers';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers,...intermediateHandlers);
