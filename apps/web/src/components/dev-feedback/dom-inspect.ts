// Attribute on every element rendered by the overlay itself, so inspection can skip it.
export const UI_ATTRIBUTE = 'data-dev-feedback-ui';

const MAX_SNIPPET_LENGTH = 500;

export function isOverlayElement(el: Element): boolean {
  return el.closest(`[${UI_ATTRIBUTE}]`) !== null;
}

// Nearest ancestor (or the element itself) tagged by devComponentProps.
export function findNearestComponent(el: Element): HTMLElement | null {
  return el.closest<HTMLElement>('[data-component]');
}

// CSS path from <body> down to el, e.g. "body > main > section:nth-of-type(1)".
export function buildSelector(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current.tagName !== 'BODY') {
    const node: Element = current;
    const parent: Element | null = node.parentElement;
    const tag = node.tagName.toLowerCase();

    if (!parent) {
      parts.unshift(tag);
      break;
    }

    const siblings = Array.from(parent.children).filter(
      (child) => child.tagName === node.tagName,
    );
    const index = siblings.indexOf(node) + 1;
    parts.unshift(`${tag}:nth-of-type(${index})`);
    current = parent;
  }

  return ['body', ...parts].join(' > ');
}

// Whitespace-collapsed text of el, cut to a sane length.
export function extractTextSnippet(el: Element): string {
  return (el.textContent ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_SNIPPET_LENGTH);
}
