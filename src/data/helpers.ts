export const NOT_AVAILABLE = 'Not available';

export const notAvailable = (keys: string[]): Record<string, string> =>
  Object.fromEntries(keys.map(key => [key, NOT_AVAILABLE]));
