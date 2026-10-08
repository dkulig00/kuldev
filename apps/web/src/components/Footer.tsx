import { devComponentProps } from '@/lib/dev-feedback/component-tag';

interface FooterNavItem {
  id: string;
  label: string;
}

interface FooterProps {
  navItems: FooterNavItem[];
  email: string;
}

const linkStyle =
  'text-muted hover:text-ink focus-visible:outline-accent-text py-2 focus-visible:outline-2 focus-visible:outline-offset-2';

export function Footer({ navItems, email }: Readonly<FooterProps>) {
  const year = new Date().getFullYear();

  return (
    <footer
      {...devComponentProps('Footer', 'src/components/Footer.tsx')}
      className="border-line bg-bg border-t"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-heading text-ink flex items-baseline gap-1.5 text-lg">
          kuldev
          <span aria-hidden="true" className="bg-accent size-2" />
        </p>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={linkStyle}>
              {item.label}
            </a>
          ))}
          <a href={`mailto:${email}`} className={linkStyle}>
            {email}
          </a>
        </nav>

        <p className="text-muted text-sm">© {year} kuldev</p>
      </div>
    </footer>
  );
}
