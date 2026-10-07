import { cleanup, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { FaderTrack } from './FaderTrack';
import { MotionProvider } from './motion';

function track(level = 0.75) {
  return (
    <MotionProvider>
      <FaderTrack index={0} level={level} />
    </MotionProvider>
  );
}

describe('FaderTrack', () => {
  afterEach(cleanup);

  it('is hidden from assistive technology as a whole', () => {
    const { container } = render(track());

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('drives the fill and the cap with scroll transforms', () => {
    const { container } = render(track());

    expect(container.querySelectorAll('[data-scroll]')).toHaveLength(2);
  });

  it('server-renders the cap at its level, never at the start position', () => {
    const html = renderToString(track(0.75));

    expect(html).toContain('25%');
    expect(html).not.toContain('85%');
  });
});
