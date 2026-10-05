import { parseDevAllowedOrigins } from '@/lib/dev-feedback/dev-origins';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const devAllowedOrigins = parseDevAllowedOrigins(
  process.env.DEV_ALLOWED_ORIGINS,
);

const nextConfig: NextConfig = {
  ...(devAllowedOrigins?.length
    ? { allowedDevOrigins: devAllowedOrigins }
    : {}),
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
