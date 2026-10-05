export function parseDevAllowedOrigins(
  value: string | undefined,
): string[] | undefined {
  const origins = value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins?.length ? origins : undefined;
}
