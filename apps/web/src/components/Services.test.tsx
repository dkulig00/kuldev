import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import pl from '../../messages/pl.json';
import { Services } from './Services';

const services = Object.entries(pl.services.items).map(([id, item]) => ({
  id,
  title: item.title,
  description: item.description,
  features: item.features,
  ctaLabel: item.cta,
}));

function renderServices() {
  return render(
    <Services
      heading={pl.services.heading}
      services={services}
      closing={pl.services.closing}
      ctaLabel={pl.hero.cta}
      ctaHref="#kontakt"
    />,
  );
}

describe('Services', () => {
  afterEach(cleanup);

  it('renders a section anchored at #uslugi and labelled by its heading', () => {
    renderServices();

    expect(screen.getByRole('region', { name: 'Usługi' })).toHaveAttribute(
      'id',
      'uslugi',
    );
  });

  it('renders every service with its title, description and three features', () => {
    renderServices();

    const items = screen
      .getByRole('heading', { level: 2, name: 'Usługi' })
      .parentElement?.querySelectorAll(':scope > ul > li');

    expect(items).toHaveLength(4);

    items?.forEach((item, index) => {
      const service = services[index];
      const scope = within(item as HTMLElement);

      expect(
        scope.getByRole('heading', { level: 3, name: service.title }),
      ).toBeInTheDocument();
      expect(scope.getByText(service.description)).toBeInTheDocument();
      service.features.forEach((feature) => {
        expect(scope.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  it('numbers services 01 to 04 and hides the numbers from screen readers', () => {
    renderServices();

    ['01', '02', '03', '04'].forEach((number) => {
      expect(screen.getByText(number)).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('links every service to #kontakt with a distinct, descriptive label', () => {
    renderServices();

    const labels = services.map((service) => service.ctaLabel);

    expect(new Set(labels).size).toBe(labels.length);
    labels.forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        '#kontakt',
      );
    });
  });

  it('renders the closing statement', () => {
    renderServices();

    expect(screen.getByText(pl.services.closing)).toBeInTheDocument();
  });

  it('links the closing statement to #kontakt with a quote CTA', () => {
    renderServices();

    const cta = screen.getAllByRole('link', { name: pl.hero.cta });
    expect(cta).toHaveLength(1);
    expect(cta[0]).toHaveAttribute('href', '#kontakt');
  });
});
