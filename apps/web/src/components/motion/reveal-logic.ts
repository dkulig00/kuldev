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

function isLinkedFromHash(element: Element, hash: string): boolean {
  const id = hash.slice(1);

  if (id === '') {
    return false;
  }

  const target = element.ownerDocument.getElementById(decodeHashId(id));

  if (target === null) {
    return false;
  }

  return target.contains(element) || element.contains(target);
}

function decodeHashId(id: string): string {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}
