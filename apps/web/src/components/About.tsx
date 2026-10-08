import { devComponentProps } from '@/lib/dev-feedback/component-tag';

interface Principle {
  title: string;
  description: string;
}

interface AboutProps {
  heading: string;
  name: string;
  role: string;
  paragraphs: string[];
  principlesLabel: string;
  principles: Principle[];
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('');
}

export function About({
  heading,
  name,
  role,
  paragraphs,
  principlesLabel,
  principles,
}: Readonly<AboutProps>) {
  return (
    <section
      {...devComponentProps('About', 'src/components/About.tsx')}
      id="o-mnie"
      aria-labelledby="o-mnie-heading"
      className="bg-surface"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div>
            <h2
              id="o-mnie-heading"
              className="font-heading text-ink text-3xl leading-tight sm:text-5xl"
            >
              {heading}
            </h2>

            <div className="mt-10 flex items-center gap-5">
              <div
                aria-hidden="true"
                className="bg-bg border-line relative flex size-20 shrink-0 items-center justify-center rounded-xl border"
              >
                <span className="font-heading text-ink text-2xl">
                  {initials(name)}
                </span>
                <span className="bg-accent absolute -top-1 -right-1 size-2.5" />
              </div>
              <div>
                <p className="font-heading text-ink text-xl">{name}</p>
                <p className="text-muted mt-1">{role}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:pt-2">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-ink max-w-prose text-lg leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <h3 className="text-muted mt-20 font-medium">{principlesLabel}</h3>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <li
              key={principle.title}
              className="bg-bg border-line rounded-xl border p-6"
            >
              <span aria-hidden="true" className="bg-accent block size-2" />
              <p className="font-heading text-ink mt-5 text-lg">
                {principle.title}
              </p>
              <p className="text-muted mt-2 leading-relaxed">
                {principle.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
