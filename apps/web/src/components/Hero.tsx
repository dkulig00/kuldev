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
    <section {...devComponentProps('Hero', 'src/components/Hero.tsx')}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
        <h1 className="font-heading text-ink max-w-4xl text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="text-muted mt-6 max-w-2xl text-lg sm:text-xl">
          {subtitle}
        </p>
        <a
          href={ctaHref}
          className="bg-accent text-accent-ink border-accent-text hover:bg-accent/85 focus-visible:outline-accent-text mt-10 inline-flex min-h-12 items-center rounded-md border px-6 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
