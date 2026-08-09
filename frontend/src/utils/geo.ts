'use client';

/**
 * Converts an ISO 3166-1 alpha-2 country code to an emoji flag.
 * Works in all modern browsers.
 */
export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const upper = code.toUpperCase();
  return (
    String.fromCodePoint(0x1f1e6 + upper.charCodeAt(0) - 65) +
    String.fromCodePoint(0x1f1e6 + upper.charCodeAt(1) - 65)
  );
}

/**
 * Fetches the current user's country using ip-api.com (free, no API key).
 * Returns null on failure or for localhost.
 */
export async function detectMyCountry(): Promise<{ country: string; countryCode: string } | null> {
  try {
    const res = await fetch('http://ip-api.com/json/?fields=country,countryCode,status', {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success') return null;
    return { country: data.country, countryCode: data.countryCode };
  } catch {
    return null;
  }
}

/** List of popular countries for the selector. */
export const COUNTRY_LIST = [
  { code: 'ANY', name: 'Qualquer País', flag: '🌍' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CO', name: 'Colômbia', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
  { code: 'FR', name: 'França', flag: '🇫🇷' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'RU', name: 'Rússia', flag: '🇷🇺' },
  { code: 'IN', name: 'Índia', flag: '🇮🇳' },
  { code: 'JP', name: 'Japão', flag: '🇯🇵' },
  { code: 'KR', name: 'Coreia do Sul', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'AU', name: 'Austrália', flag: '🇦🇺' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'TR', name: 'Turquia', flag: '🇹🇷' },
  { code: 'PH', name: 'Filipinas', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonésia', flag: '🇮🇩' },
  { code: 'NG', name: 'Nigéria', flag: '🇳🇬' },
  { code: 'ZA', name: 'África do Sul', flag: '🇿🇦' },
];
