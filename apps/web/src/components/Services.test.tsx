import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import pl from '../../messages/pl.json';
import { Services } from './Services';

const services = Object.entries(pl.services.items).map(([id, item]) => ({
  id,
  title: item.title,
  description: item.description,
  features: item.features,
}));

function renderServices() {
  return render(<Services heading={pl.services.heading} services={services} />);
}

function serviceBlocks() {
  const heading = screen.getByRole('heading', { level: 2, name: 'Usługi' });

  return within(heading.parentElement as HTMLElement)
    .getAllByRole('listitem')
    .filter((item) => item.parentElement?.previousElementSibling === heading);
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

  it('renders every service as a block with title, description and features', () => {
    renderServices();

    const blocks = serviceBlocks();
    expect(blocks).toHaveLength(4);

    blocks.forEach((block, index) => {
      const service = services[index];
      const scope = within(block);

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

  it('has no links inside the service blocks', () => {
    renderServices();

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
