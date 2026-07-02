import type { PublicPackPayload } from '../types/public-pack';

export function parsePayloadJson(raw: unknown): PublicPackPayload | undefined {
  if (raw == null) return undefined;

  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as PublicPackPayload;
    } catch {
      return undefined;
    }
  }

  if (typeof raw === 'object') {
    return raw as PublicPackPayload;
  }

  return undefined;
}
