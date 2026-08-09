import { logger } from '../utils/logger';

export interface GeoInfo {
  country: string;
  countryCode: string;
}

const cache = new Map<string, GeoInfo>();

/**
 * Detects country from an IP address using ip-api.com (free, no API key needed).
 * Results are cached in memory to avoid redundant requests.
 * Returns undefined for localhost/private IPs.
 */
export async function detectCountryFromIp(ip: string): Promise<GeoInfo | undefined> {
  // Skip localhost / private addresses
  if (
    !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.')
  ) {
    return undefined;
  }

  // Strip IPv6 prefix if present
  const cleanIp = ip.startsWith('::ffff:') ? ip.slice(7) : ip;

  if (cache.has(cleanIp)) {
    return cache.get(cleanIp);
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${cleanIp}?fields=country,countryCode,status`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return undefined;

    const data = await res.json() as { status: string; country: string; countryCode: string };

    if (data.status !== 'success') return undefined;

    const geoInfo: GeoInfo = {
      country: data.country,
      countryCode: data.countryCode,
    };

    cache.set(cleanIp, geoInfo);
    return geoInfo;
  } catch (err: any) {
    logger.warn(`GeoIP lookup failed for ${cleanIp}: ${err.message}`);
    return undefined;
  }
}

/**
 * Returns the emoji flag for a given ISO 3166-1 alpha-2 country code.
 * Works in all modern browsers and Node.js 18+.
 */
export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}
