'use client';

import { useEffect, useRef, useState } from 'react';
import {
  buildSelector,
  extractTextSnippet,
  findNearestComponent,
  isOverlayElement,
} from './dom-inspect';
import { StatusMessage } from './StatusMessage';

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
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
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

  useEffect(() => {
    if (status !== 'sent') return;

    const timer = setTimeout(() => setStatus('idle'), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  async function submitFeedback() {
    if (!draft) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/dev-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          language: document.documentElement.lang,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          userAgent: navigator.userAgent,
          selector: draft.selector,
          componentName: draft.componentName,
          componentFile: draft.componentFile,
          textSnippet: draft.textSnippet,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus('sent');
      setComment('');
      setDraft(null);
    } catch {
      setStatus('error');
    }
  }

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

      {status === 'sent' && (
        <div className="animate-slide-down fixed top-4 left-1/2 z-50 -translate-x-1/2 motion-reduce:animate-none">
          <StatusMessage variant="success">Zapisano uwagę</StatusMessage>
        </div>
      )}

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
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            aria-label="Komentarz"
            rows={4}
            className="border-ink/30 mt-4 w-full rounded-md border p-2"
          />

          {status === 'error' && (
            <p role="alert" className="mt-2 text-sm font-medium">
              Nie udało się wysłać. Spróbuj ponownie.
            </p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="min-h-11 px-4"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={submitFeedback}
              disabled={status === 'sending'}
              className="bg-accent-amber text-background min-h-11 rounded-md px-4 font-medium disabled:opacity-60"
            >
              {status === 'sending' ? 'Wysyłanie…' : 'Wyślij'}
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
