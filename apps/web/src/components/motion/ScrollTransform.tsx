'use client';

import { useReducedMotion, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
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

// Decorative only: before the animation features load, an active element
// stays in its `from` state, so it must never wrap content.
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

  const end = { ...identity, ...to };
  const start = { ...end, ...from };
  const input = [range[0], range[1]];

  const y = useTransform(scrollYProgress, input, [start.y, end.y]);
  const scaleY = useTransform(scrollYProgress, input, [
    start.scaleY,
    end.scaleY,
  ]);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    setActive(
      shouldActivateScrollTransform({
        element,
        top: element.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
        hash: window.location.hash,
        reducedMotion: reducedMotion === true,
      }),
    );
  }, [reducedMotion]);

  return (
    <m.div
      ref={ref}
      aria-hidden="true"
      data-scroll={active ? 'active' : 'static'}
      className={className}
      style={active ? { y, scaleY } : end}
    >
      {children}
    </m.div>
  );
}
