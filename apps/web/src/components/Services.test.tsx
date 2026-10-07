import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import pl from '../../messages/pl.json';
import { MotionProvider } from './motion';
import { Services } from './Services';

const channels = Object.entries(pl.services.items).map(([id, item]) => ({
  id,
  title: item.title,
  description: item.description,
  features: item.features,
  ctaLabel: item.cta,
}));

function renderServices() {
  return render(
    <MotionProvider>
      <Services
        heading={pl.services.heading}
        channels={channels}
        closing={pl.services.closing}
        ctaHref="#kontakt"
        level={0.75}
      />
    </MotionProvider>,
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

  it('renders every channel with its title, description and three features', () => {
    renderServices();

    const items = screen
      .getByRole('heading', { level: 2, name: 'Usługi' })
      .parentElement?.querySelectorAll(':scope > ul > li');

    expect(items).toHaveLength(4);

    items?.forEach((item, index) => {
      const channel = channels[index];
      const scope = within(item as HTMLElement);

      expect(
        scope.getByRole('heading', { level: 3, name: channel.title }),
      ).toBeInTheDocument();
      expect(scope.getByText(channel.description)).toBeInTheDocument();
      channel.features.forEach((feature) => {
        expect(scope.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  it('numbers channels 01 to 04 and hides the numbers from screen readers', () => {
    renderServices();

    ['01', '02', '03', '04'].forEach((number) => {
      expect(screen.getByText(number)).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('links every channel to #kontakt with a distinct, descriptive label', () => {
    renderServices();

    const labels = channels.map((channel) => channel.ctaLabel);

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

  it('gives every channel a decorative fader track', () => {
    const { container } = renderServices();

    expect(container.querySelectorAll('[data-scroll]')).toHaveLength(8);
    container.querySelectorAll('[data-scroll]').forEach((element) => {
      expect(element.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });
});
