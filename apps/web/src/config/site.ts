export function getSiteUrl(): URL {
  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    throw new Error(
      'Missing SITE_URL environment variable - see apps/web/.env.example',
    );
  }
  return new URL(siteUrl);
}
