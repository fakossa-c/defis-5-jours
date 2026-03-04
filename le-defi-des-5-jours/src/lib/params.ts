import type { ProspectParams } from '@/types';

const DEFAULT_ACCENT_COLOR = '#F96743';
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const MAX_PARAM_LENGTH = 200;

export function sanitizeString(value: string | undefined | null): string | null {
  if (value == null || value === '') return null;

  // Suppression des balises HTML — l'encodage des entités est géré par React en contexte JSX
  let sanitized = value.replace(/<[^>]*>/g, '');

  sanitized = sanitized.trim().slice(0, MAX_PARAM_LENGTH);

  return sanitized === '' ? null : sanitized;
}

export function validateHexColor(value: string | undefined | null): string {
  if (value == null || value === '') return DEFAULT_ACCENT_COLOR;
  const trimmed = value.trim();
  return HEX_COLOR_REGEX.test(trimmed) ? trimmed : DEFAULT_ACCENT_COLOR;
}

function extractParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseProspectParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProspectParams {
  return {
    company: sanitizeString(extractParam(searchParams, 'company')),
    role: sanitizeString(extractParam(searchParams, 'role')),
    sector: sanitizeString(extractParam(searchParams, 'sector')),
    color: validateHexColor(extractParam(searchParams, 'color')),
    contact: sanitizeString(extractParam(searchParams, 'contact')),
    source: sanitizeString(extractParam(searchParams, 'source')),
  };
}
