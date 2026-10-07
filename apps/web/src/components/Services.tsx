import { devComponentProps } from '@/lib/dev-feedback/component-tag';
import { FaderTrack } from './FaderTrack';

interface ServiceChannel {
  id: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

interface ServicesProps {
  heading: string;
  channels: ServiceChannel[];
  closing: string;
  ctaHref: string;
  level: number;
}

function channelNumber(index: number) {
  return String(index + 1).padStart(2, '0');
}

export function Services({
  heading,
  channels,
  closing,
  ctaHref,
  level,
}: Readonly<ServicesProps>) {
  return (
    <section
      {...devComponentProps('Services', 'src/components/Services.tsx')}
      id="uslugi"
      aria-labelledby="uslugi-heading"
      className="px-4 py-16 sm:px-6 sm:py-24"
    >
      <h2
        id="uslugi-heading"
        className="font-display text-ink text-3xl font-bold sm:text-4xl"
      >
        {heading}
      </h2>

      <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {channels.map((channel, index) => (
          <li
            key={channel.id}
            className="group bg-panel border-ink/10 hover:border-accent-amber focus-within:border-accent-amber flex gap-5 rounded-sm border p-5"
          >
            <FaderTrack index={index} level={level} />

            <div className="flex min-w-0 flex-col">
              <span
                aria-hidden="true"
                className="text-ink/70 group-hover:bg-accent-amber group-hover:text-background group-focus-within:bg-accent-amber group-focus-within:text-background self-start rounded-sm px-1.5 font-mono text-sm"
              >
                {channelNumber(index)}
              </span>

              <h3 className="font-display text-ink mt-3 text-2xl font-bold">
                {channel.title}
              </h3>
              <p className="text-ink/80 mt-3">{channel.description}</p>

              <ul className="mt-4 space-y-2">
                {channel.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-ink/80 before:bg-ink/40 relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-3"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={ctaHref}
                className="text-ink decoration-accent-amber focus-visible:outline-accent-amber mt-auto self-start pt-6 font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {channel.ctaLabel}
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-panel border-accent-amber mt-4 border-t-2 p-5 sm:p-6">
        <p className="text-ink max-w-prose text-lg">{closing}</p>
      </div>
    </section>
  );
}
