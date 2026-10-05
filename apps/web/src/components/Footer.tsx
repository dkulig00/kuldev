import { devComponentProps } from '@/lib/dev-feedback/component-tag';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      {...devComponentProps('Footer', 'src/components/Footer.tsx')}
      className="text-ink/60 px-4 py-8 text-sm sm:px-6"
    >
      <p>kuldev © {year}</p>
    </footer>
  );
}
