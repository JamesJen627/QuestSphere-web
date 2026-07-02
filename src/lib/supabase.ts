import type { PublicPackRow } from '../types/public-pack';

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
  return rows[0] ?? null;
}

export async function listPublicPacks(limit = 50): Promise<PublicPackRow[]> {
  assertConfigured();

  const url = new URL(`${supabaseUrl}/rest/v1/public_packs`);
  url.searchParams.set(
    'select',
    'pack_id,title,description,tags,author_nickname,question_count,version,updated_at',
  );
  url.searchParams.set('order', 'updated_at.desc');
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`Supabase 请求失败：${res.status}`);
  }

  return (await res.json()) as PublicPackRow[];
}
