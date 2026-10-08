interface MailtoOptions {
  subject?: string;
  body?: string;
}

// RFC 6068: line breaks in a mailto body are encoded as CRLF.
function encodeField(value: string) {
  return encodeURIComponent(value.replace(/\r?\n/g, '\r\n'));
}

export function mailtoHref(email: string, options: MailtoOptions = {}) {
  const query = Object.entries(options)
    .filter(([, value]) => typeof value === 'string' && value !== '')
    .map(([name, value]) => `${name}=${encodeField(value as string)}`)
    .join('&');

  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}
