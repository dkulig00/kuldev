import { isLinkedFromHash } from './hash-link';

interface ScrollTransformContext {
  element: Element;
  top: number;
  viewportHeight: number;
  hash: string;
  reducedMotion: boolean;
}

export function shouldActivateScrollTransform({
  element,
  top,
  viewportHeight,
  hash,
  reducedMotion,
}: Readonly<ScrollTransformContext>): boolean {
  if (reducedMotion || top <= viewportHeight) {
    return false;
  }

  return !isLinkedFromHash(element, hash);
}
