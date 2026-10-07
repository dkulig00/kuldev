'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import { ReactNode } from 'react';

const loadFeatures = () =>
  import('./features').then((module) => module.default);

export function MotionProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
