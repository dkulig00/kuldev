'use client';

import { useEffect, useState } from 'react';
import { findNearestComponent, isOverlayElement } from './dom-inspect';

interface Hover {
  name: string;
  rect: DOMRect;
}

export const OVERLAY_MARKER = '__KULDEV_DEV_FEEDBACK_OVERLAY__';

export function DevFeedbackOverlay() {
  const [inspecting, setInspecting] = useState(false);

  const [hover, setHover] = useState<Hover | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === '.') {
        event.preventDefault();
        setInspecting((on) => !on);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!inspecting) return;

    function handlePointerMove(event: PointerEvent) {
      const el = document.elementFromPoint(event.clientX, event.clientY);
      const tagged =
        el && !isOverlayElement(el) ? findNearestComponent(el) : null;

      setHover(
        tagged
          ? {
              name: tagged.getAttribute('data-component') ?? '',
              rect: tagged.getBoundingClientRect(),
            }
          : null,
      );
    }

    document.addEventListener('pointermove', handlePointerMove);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      setHover(null);
    };
  }, [inspecting]);

  return (
    <div data-dev-feedback-ui data-dev-feedback-marker={OVERLAY_MARKER}>
      <button
        type="button"
        aria-pressed={inspecting}
        onClick={() => setInspecting((on) => !on)}
        className="bg-accent-amber text-background fixed right-4 bottom-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-md px-4 text-sm font-medium"
      >
        {inspecting ? 'Wyłącz zaznaczanie' : 'Zaznacz element'}
      </button>
      {hover && (
        <div
          className="border-accent-amber bg-accent-amber/10 pointer-events-none fixed z-40 border-2"
          style={{
            top: hover.rect.top,
            left: hover.rect.left,
            width: hover.rect.width,
            height: hover.rect.height,
          }}
        >
          <span className="bg-accent-amber text-background absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium">
            {hover.name}
          </span>
        </div>
      )}
    </div>
  );
}
