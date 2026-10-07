import { isLinkedFromHash } from './hash-link';

interface RevealContext {
  element: Element;
  top: number;
  viewportHeight: number;
  hash: string;
  reducedMotion: boolean;
}

export function shouldArmReveal({
  element,
  top,
  viewportHeight,
  hash,
  reducedMotion,
}: Readonly<RevealContext>): boolean {
  if (reducedMotion || top <= viewportHeight) {
    return false;
  }

  return !isLinkedFromHash(element, hash);
}
