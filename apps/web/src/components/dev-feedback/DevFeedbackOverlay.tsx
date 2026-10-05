'use client';

import { useEffect, useRef, useState } from 'react';
import {
  buildSelector,
  extractTextSnippet,
  findNearestComponent,
  isOverlayElement,
} from './dom-inspect';

interface Hover {
  name: string;
  rect: DOMRect;
}

interface Draft {
  selector: string;
  componentName: string;
  componentFile: string;
  textSnippet: string;
}

export const OVERLAY_MARKER = '__KULDEV_DEV_FEEDBACK_OVERLAY__';

export function DevFeedbackOverlay() {
  const [inspecting, setInspecting] = useState(false);
  const [hover, setHover] = useState<Hover | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
              name: tagged.dataset.component ?? '',
              rect: tagged.getBoundingClientRect(),
            }
          : null,
      );
    }

    // Capture phase: runs before the page's own handlers, so the action is blocked.
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element) || isOverlayElement(target)) return;

      event.preventDefault();
      event.stopPropagation();

      const tagged = findNearestComponent(target);
      setDraft({
        selector: buildSelector(target),
        componentName: tagged?.dataset.component ?? '',
        componentFile: tagged?.dataset.componentFile ?? '',
        textSnippet: extractTextSnippet(target),
      });
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('click', handleClick, true);
      setHover(null);
    };
  }, [inspecting]);

  useEffect(() => {
    if (!draft) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    textareaRef.current?.focus();
  }, [draft]);

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

      {draft && (
        <dialog
          ref={dialogRef}
          aria-labelledby="dev-feedback-title"
          onClose={() => setDraft(null)}
          className="bg-panel text-ink m-auto w-full max-w-md rounded-md p-4 shadow-lg backdrop:bg-black/40"
        >
          <h2 id="dev-feedback-title" className="text-lg font-semibold">
            Uwaga dla AI
          </h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div>
              <dt className="inline font-medium">Komponent: </dt>
              <dd className="inline">{draft.componentName || '—'}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Selektor: </dt>
              <dd className="inline font-mono text-xs break-all">
                {draft.selector}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Tekst: </dt>
              <dd className="inline">{draft.textSnippet || '—'}</dd>
            </div>
          </dl>
          <textarea
            ref={textareaRef}
            aria-label="Komentarz"
            rows={4}
            className="border-ink/30 mt-4 w-full rounded-md border p-2"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="min-h-11 px-4"
            >
              Anuluj
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
