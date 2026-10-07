import { devComponentProps } from '@/lib/dev-feedback/component-tag';
import { ScrollTransform } from './motion';

interface FaderTrackProps {
  index: number;
  level: number;
}

const START_LEVEL = 0.15;
const STAGGER = 0.08;

function capOffset(level: number) {
  return `${(1 - level) * 100}%`;
}

export function FaderTrack({ index, level }: Readonly<FaderTrackProps>) {
  const range = [index * STAGGER, 0.6 + index * STAGGER] as const;

  return (
    <div
      {...devComponentProps('FaderTrack', 'src/components/FaderTrack.tsx')}
      aria-hidden="true"
      className="bg-ink/15 relative w-3 shrink-0 self-stretch rounded-full"
    >
      <ScrollTransform
        from={{ scaleY: START_LEVEL }}
        to={{ scaleY: level }}
        range={range}
        className="bg-accent-amber/70 absolute inset-0 origin-bottom rounded-full"
      />
      <ScrollTransform
        from={{ y: capOffset(START_LEVEL) }}
        to={{ y: capOffset(level) }}
        range={range}
        className="absolute inset-0"
      >
        <span className="bg-ink group-hover:bg-accent-amber group-focus-within:bg-accent-amber block h-3 w-5 -translate-x-1 rounded-sm" />
      </ScrollTransform>
    </div>
  );
}
