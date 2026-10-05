import { devComponentProps } from '@/lib/dev-feedback/component-tag';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: Readonly<HeroProps>) {
  return (
    <section
      {...devComponentProps('Hero', 'src/components/Hero.tsx')}
      className="px-4 py-16 sm:px-6 sm:py-24"
    >
      <h1 className="font-display text-ink text-4xl font-bold sm:text-5xl">
        {title}
      </h1>
      <p className="text-ink/80 mt-4 max-w-prose text-lg">{subtitle}</p>
      <a
        href={ctaHref}
        className="bg-accent-amber text-background mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 font-medium"
      >
        {ctaLabel}
      </a>
    </section>
  );
}
