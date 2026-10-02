interface ContactProps {
  heading: string;
  body: string;
  email: string;
  emailLabel: string;
}

export function Contact({
  heading,
  body,
  email,
  emailLabel,
}: Readonly<ContactProps>) {
  return (
    <section id="kontakt" className="bg-panel px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-display text-ink text-3xl font-bold sm:text-4xl">
        {heading}
      </h2>
      <p className="text-ink/80 mt-4 max-w-prose text-lg">{body}</p>
      <a
        href={`mailto:${email}`}
        className="bg-accent-cyan text-background mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 font-medium"
      >
        {emailLabel}
      </a>
    </section>
  );
}
