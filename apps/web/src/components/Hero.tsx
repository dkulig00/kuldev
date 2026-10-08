import { devComponentProps } from '@/lib/dev-feedback/component-tag';

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  servicesLabel: string;
  servicesHref: string;
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  servicesLabel,
  servicesHref,
}: Readonly<HeroProps>) {
  return (
    <section
      {...devComponentProps('Hero', 'src/components/Hero.tsx')}
      className="relative overflow-hidden"
    >
      {/* Soft light where the workflow diagram sits: the part of the page
          where the system "works". Decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_45%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-28 sm:pb-36">
        <p className="text-accent-text font-medium">{eyebrow}</p>
        <h1 className="font-heading text-ink mt-5 max-w-4xl text-4xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
          {subtitle}
        </p>
        <a
          href={servicesHref}
          className="text-ink border-muted hover:border-accent-text focus-visible:outline-accent-text mt-10 inline-flex min-h-12 items-center rounded-md border px-6 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {servicesLabel}
        </a>
      </div>
    </section>
  );
}
