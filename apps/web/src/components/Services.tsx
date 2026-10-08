import { devComponentProps } from '@/lib/dev-feedback/component-tag';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

interface ServicesProps {
  heading: string;
  services: Service[];
  closing: string;
  ctaLabel: string;
  ctaHref: string;
}

function serviceNumber(index: number) {
  return String(index + 1).padStart(2, '0');
}

export function Services({
  heading,
  services,
  closing,
  ctaLabel,
  ctaHref,
}: Readonly<ServicesProps>) {
  return (
    <section
      {...devComponentProps('Services', 'src/components/Services.tsx')}
      id="uslugi"
      aria-labelledby="uslugi-heading"
      className="border-line border-t"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <h2
          id="uslugi-heading"
          className="font-heading text-ink text-3xl leading-tight sm:text-5xl"
        >
          {heading}
        </h2>

        <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="border-line flex flex-col border-t py-8"
            >
              <span
                aria-hidden="true"
                className="text-accent-text font-mono text-sm"
              >
                {serviceNumber(index)}
              </span>
              <h3 className="font-heading text-ink mt-3 text-2xl">
                {service.title}
              </h3>
              <p className="text-muted mt-3 max-w-prose">
                {service.description}
              </p>
              <ul className="mt-5 space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-ink before:bg-accent relative pl-5 before:absolute before:top-[0.6em] before:left-0 before:size-1.5"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={ctaHref}
                className="text-ink decoration-accent-text focus-visible:outline-accent-text mt-auto self-start pt-6 font-medium underline decoration-2 underline-offset-6 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {service.ctaLabel}
              </a>
            </li>
          ))}
        </ul>

        <div className="bg-surface border-line mt-8 flex flex-col gap-6 rounded-sm border p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <p className="text-ink max-w-2xl text-lg">{closing}</p>
          <a
            href={ctaHref}
            className="bg-accent text-accent-ink border-accent-text hover:bg-accent/85 focus-visible:outline-accent-text inline-flex min-h-11 shrink-0 items-center self-start rounded-md border px-5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 md:self-center"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
