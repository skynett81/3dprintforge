// Registers @testing-library/jest-dom matchers on Vitest's expect (and their
// TypeScript types), and unmounts rendered trees between tests so queries
// don't see leftover DOM from earlier cases.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());
