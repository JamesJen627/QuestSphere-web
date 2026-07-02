import type { PublicPackRow } from '../types/public-pack';
import { parsePayloadJson } from './payload';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

function getHeaders(): HeadersInit {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };
}

function assertConfigured(): void {
  if (!supabaseUrl || !anonKey) {
    throw new Error(
      '缺少 Supabase 环境变量：请配置 PUBLIC_SUPABASE_URL 与 PUBLIC_SUPABASE_ANON_KEY',
    );
  }
}

function normalizePackRow(row: PublicPackRow): PublicPackRow {
  const payload = parsePayloadJson(row.payload_json);
  return payload ? { ...row, payload_json: payload } : row;
}

export async function fetchPublicPack(packId: string): Promise<PublicPackRow | null> {
  assertConfigured();

  const url = new URL(`${supabaseUrl}/rest/v1/public_packs`);
  url.searchParams.set('select', '*');
  url.searchParams.set('pack_id', `eq.${packId}`);
  url.searchParams.set('limit', '1');

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`Supabase 请求失败：${res.status}`);
  }

  const rows = (await res.json()) as PublicPackRow[];
  const row = rows[0];
  return row ? normalizePackRow(row) : null;
}

export interface ListPublicPacksOptions {
  limit?: number;
  query?: string;
}

export async function listPublicPacks(options: ListPublicPacksOptions = {}): Promise<PublicPackRow[]> {
  assertConfigured();

  const { limit = 50, query } = options;
  const url = new URL(`${supabaseUrl}/rest/v1/public_packs`);
  url.searchParams.set(
    'select',
    'pack_id,title,description,tags,author_nickname,question_count,version,updated_at',
  );
  url.searchParams.set('order', 'updated_at.desc');
  url.searchParams.set('limit', String(limit));

  const trimmedQuery = query?.trim();
  if (trimmedQuery) {
    const term = `%${trimmedQuery}%`;
    url.searchParams.set(
      'or',
      `(title.ilike.${term},description.ilike.${term},author_nickname.ilike.${term})`,
    );
  }

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`Supabase 请求失败：${res.status}`);
  }

  return (await res.json()) as PublicPackRow[];
}

export async function listPublicPackIds(limit = 500): Promise<string[]> {
  assertConfigured();

  const url = new URL(`${supabaseUrl}/rest/v1/public_packs`);
  url.searchParams.set('select', 'pack_id');
  url.searchParams.set('order', 'updated_at.desc');
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`Supabase 请求失败：${res.status}`);
  }

  const rows = (await res.json()) as { pack_id: string }[];
  return rows.map((row) => row.pack_id);
}
