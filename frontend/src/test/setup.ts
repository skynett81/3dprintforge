// Registers @testing-library/jest-dom matchers on Vitest's expect (and their
// TypeScript types), and unmounts rendered trees between tests so queries
// don't see leftover DOM from earlier cases.
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Node 20+/Vitest 4 expose a global `WebSocket` (undici) in the test env. The
// dashboard hook (src/hooks.ts) guards on `typeof WebSocket === 'undefined'` to
// skip connecting under test; with a real global present it would attempt a
// live connection and throw an unhandled async error. Remove the global so the
// hook's existing "test env without WS" path is taken, matching prior behaviour.
vi.stubGlobal('WebSocket', undefined);

afterEach(() => cleanup());
