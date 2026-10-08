import { cleanup, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MotionProvider } from './MotionProvider';

describe('MotionProvider', () => {
  afterEach(async () => {
    cleanup();
    // MotionProvider loads its features asynchronously. Wait for that import
    // here, so it never settles after jsdom has been torn down.
    await import('./features');
  });

  it('renders its children', () => {
    render(
      <MotionProvider>
        <p>Treść strony</p>
      </MotionProvider>,
    );

    expect(screen.getByText('Treść strony')).toBeInTheDocument();
  });

  it('rejects full motion components inside (strict mode)', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() =>
      render(
        <MotionProvider>
          <motion.div />
        </MotionProvider>,
      ),
    ).toThrow(/LazyMotion/);

    consoleError.mockRestore();
  });
});
