import { devComponentProps } from '@/lib/dev-feedback/component-tag';
import { Reveal } from './motion';

interface ContactPath {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

interface ContactProps {
  heading: string;
  body: string;
  paths: ContactPath[];
}

const primaryAction =
  'bg-accent text-accent-ink border-accent-text hover:bg-accent/85';
const secondaryAction = 'text-ink border-muted hover:border-accent-text';

export function Contact({ heading, body, paths }: Readonly<ContactProps>) {
  return (
    <section
      {...devComponentProps('Contact', 'src/components/Contact.tsx')}
      id="kontakt"
      aria-labelledby="kontakt-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <h2
            id="kontakt-heading"
            className="font-heading text-ink max-w-3xl text-3xl leading-tight sm:text-5xl"
          >
            {heading}
          </h2>
          <p className="text-muted mt-6 max-w-2xl text-lg">{body}</p>

          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {paths.map((path, index) => (
              <li
                key={path.id}
                className="bg-surface border-line flex flex-col rounded-xl border p-6 sm:p-8"
              >
                <h3 className="font-heading text-ink text-xl sm:text-2xl">
                  {path.title}
                </h3>
                <p className="text-muted mt-3 mb-8 max-w-prose leading-relaxed">
                  {path.description}
                </p>
                <a
                  href={path.href}
                  className={`${index === 0 ? primaryAction : secondaryAction} focus-visible:outline-accent-text mt-auto inline-flex min-h-11 items-center self-start rounded-md border px-5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2`}
                >
                  {path.ctaLabel}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
