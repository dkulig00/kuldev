import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom has no IntersectionObserver; Motion's useInView needs one to mount.
// This stub never reports an intersection, so elements stay "out of view".
class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
