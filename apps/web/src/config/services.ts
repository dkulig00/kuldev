export const serviceIds = ['web', 'mobile', 'automation', 'design'] as const;

export type ServiceId = (typeof serviceIds)[number];
