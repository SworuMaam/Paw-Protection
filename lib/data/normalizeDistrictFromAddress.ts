import { DISTRICTS } from './districts';

export function normalizeDistrictFromAddress(address: string): string {
  if (!address) return '';

  const lower = address.toLowerCase();

  for (const key in DISTRICTS) {
    if (lower.includes(key)) {
      return DISTRICTS[key];
    }
  }

  return '';
}
