import { devComponentProps } from '@/lib/dev-feedback/component-tag';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
}

interface ServicesProps {
  heading: string;
  services: Service[];
}

function serviceNumber(index: number) {
  return String(index + 1).padStart(2, '0');
}

export function Services({ heading, services }: Readonly<ServicesProps>) {
  return (
    <section
      {...devComponentProps('Services', 'src/components/Services.tsx')}
      id="uslugi"
      aria-labelledby="uslugi-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <h2
          id="uslugi-heading"
          className="font-heading text-ink text-3xl leading-tight sm:text-5xl"
        >
          {heading}
        </h2>

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <li
              key={service.id}
              className="group bg-surface border-line hover:border-accent-text flex flex-col rounded-xl border p-6 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="bg-accent size-2 transition-transform duration-300 group-hover:scale-150 motion-reduce:transition-none"
                />
                <span
                  aria-hidden="true"
                  className="text-accent-text font-mono text-sm"
                >
                  {serviceNumber(index)}
                </span>
              </div>
              <h3 className="font-heading text-ink mt-6 text-2xl">
                {service.title}
              </h3>
              <p className="text-muted mt-3 max-w-prose leading-relaxed">
                {service.description}
              </p>
              <ul className="border-line mt-6 space-y-3 border-t pt-6">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-ink before:bg-line relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
