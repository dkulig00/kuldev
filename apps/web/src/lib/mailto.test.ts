import { describe, expect, it } from 'vitest';
import { mailtoHref } from './mailto';

describe('mailtoHref', () => {
  it('returns a plain mailto link without options', () => {
    expect(mailtoHref('kontakt@kuldev.pl')).toBe('mailto:kontakt@kuldev.pl');
  });

  it('encodes the subject, including Polish characters and spaces', () => {
    expect(
      mailtoHref('kontakt@kuldev.pl', { subject: 'Zapytanie ze strony' }),
    ).toBe('mailto:kontakt@kuldev.pl?subject=Zapytanie%20ze%20strony');
    expect(mailtoHref('a@b.pl', { subject: 'Wycena: żółć & co' })).toBe(
      'mailto:a@b.pl?subject=Wycena%3A%20%C5%BC%C3%B3%C5%82%C4%87%20%26%20co',
    );
  });

  it('encodes line breaks in the body as CRLF', () => {
    expect(mailtoHref('a@b.pl', { body: 'Firma:\n\nTermin:' })).toBe(
      'mailto:a@b.pl?body=Firma%3A%0D%0A%0D%0ATermin%3A',
    );
  });

  it('joins subject and body and skips empty values', () => {
    expect(mailtoHref('a@b.pl', { subject: 'Brief', body: 'Cel:' })).toBe(
      'mailto:a@b.pl?subject=Brief&body=Cel%3A',
    );
    expect(mailtoHref('a@b.pl', { subject: '', body: 'Cel:' })).toBe(
      'mailto:a@b.pl?body=Cel%3A',
    );
  });
});
