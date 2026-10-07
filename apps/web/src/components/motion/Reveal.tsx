'use client';

import { useInView, useReducedMotion, Variants } from 'motion/react';
import * as m from 'motion/react-m';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { shouldArmReveal } from './reveal-logic';

interface RevealProps {
  children: ReactNode;
  y?: number;
  delay?: number;
}

export function Reveal({ children, y = 16, delay = 0 }: Readonly<RevealProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    setArmed(
      shouldArmReveal({
        element,
        top: element.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
        hash: window.location.hash,
        reducedMotion: reducedMotion === true,
      }),
    );
  }, [reducedMotion]);

  const variants: Variants = {
    hidden: { opacity: 0, y, transition: { duration: 0 } },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: 'easeOut' },
    },
  };

  return (
    <m.div
      ref={ref}
      data-reveal={armed ? 'armed' : 'static'}
      variants={variants}
      initial={false}
      animate={armed && !inView ? 'hidden' : 'visible'}
    >
      {children}
    </m.div>
  );
}
