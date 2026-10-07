export const serviceIds = ['web', 'mobile', 'automation', 'design'] as const;

export type ServiceId = (typeof serviceIds)[number];

// One shared level for every channel: different levels would suggest a
// ranking of services.
export const FADER_LEVEL = 0.75;
