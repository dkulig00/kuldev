'use client';

import {
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { shouldActivateScrollTransform } from './scroll-transform-logic';

interface TransformValues {
  y?: string;
  scaleY?: number;
}

interface ScrollTransformProps {
  children?: ReactNode;
  from: TransformValues;
  to: TransformValues;
  range?: readonly [number, number];
  className?: string;
}

const identity = { y: '0%', scaleY: 1 };

function toTransform({ y, scaleY }: Required<TransformValues>) {
  return `translateY(${y}) scaleY(${scaleY})`;
}

// Decorative only: the element moves with scroll, so it must never wrap
// content. Until it is activated, progress is pinned to the end state.
// The transform is written straight to the element, so it does not depend
// on the lazily loaded animation features.
export function ScrollTransform({
  children,
  from,
  to,
  range = [0, 1],
  className,
}: Readonly<ScrollTransformProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end 70%'],
  });

  const activation = useMotionValue(0);
  const progress = useTransform(
    [scrollYProgress, activation],
    ([latest, activated]: number[]) => (activated === 1 ? latest : 1),
  );

  const end = { ...identity, ...to };
  const start = { ...end, ...from };
  const input = [range[0], range[1]];

  const y = useTransform(progress, input, [start.y, end.y]);
  const scaleY = useTransform(progress, input, [start.scaleY, end.scaleY]);
  const transform = useMotionTemplate`translateY(${y}) scaleY(${scaleY})`;

  useMotionValueEvent(transform, 'change', (latest) => {
    if (ref.current) {
      ref.current.style.transform = latest;
    }
  });

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const shouldActivate = shouldActivateScrollTransform({
      element,
      top: element.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
      hash: window.location.hash,
      reducedMotion: reducedMotion === true,
    });

    activation.set(shouldActivate ? 1 : 0);
    element.style.transform = transform.get();
    setActive(shouldActivate);
  }, [activation, reducedMotion, transform]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-scroll={active ? 'active' : 'static'}
      className={className}
      style={{ transform: toTransform(end) }}
    >
      {children}
    </div>
  );
}
