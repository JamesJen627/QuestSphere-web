import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  if (process.env.PUBLIC_SUPABASE_URL && process.env.PUBLIC_SUPABASE_ANON_KEY) {
    return {
      supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
      anonKey: process.env.PUBLIC_SUPABASE_ANON_KEY,
      siteUrl: process.env.PUBLIC_SITE_URL ?? 'https://questsphere-web.vercel.app',
    };
  }

  try {
    const env = Object.fromEntries(
      readFileSync('.env', 'utf8')
        .split(/\r?\n/)
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const index = line.indexOf('=');
          return [line.slice(0, index), line.slice(index + 1)];
        }),
    );

    return {
      supabaseUrl: env.PUBLIC_SUPABASE_URL,
      anonKey: env.PUBLIC_SUPABASE_ANON_KEY,
      siteUrl: env.PUBLIC_SITE_URL ?? 'https://questsphere-web.vercel.app',
    };
  } catch {
    return null;
  }
}

async function listPublicPackIds(supabaseUrl, anonKey, limit = 500) {
  const url = new URL(`${supabaseUrl}/rest/v1/public_packs`);
  url.searchParams.set('select', 'pack_id');
  url.searchParams.set('order', 'updated_at.desc');
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Supabase 请求失败：${res.status}`);
  }

  const rows = await res.json();
  return rows.map((row) => row.pack_id);
}

function buildSitemap(siteUrl, packIds) {
  const urls = packIds
    .map(
      (packId) => `  <url>
    <loc>${siteUrl}/pack/${packId}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const env = loadEnv();
const outputPath = resolve('public/sitemap-packs.xml');

if (!env?.supabaseUrl || !env?.anonKey) {
  console.warn('[sitemap-packs] 未配置 Supabase 环境变量，生成空 sitemap');
  writeFileSync(outputPath, buildSitemap('https://questsphere-web.vercel.app', []), 'utf8');
  process.exit(0);
}

try {
  const packIds = await listPublicPackIds(env.supabaseUrl, env.anonKey);
  writeFileSync(outputPath, buildSitemap(env.siteUrl, packIds), 'utf8');
  console.log(`[sitemap-packs] 已写入 ${packIds.length} 个公开包 URL`);
} catch (error) {
  console.warn('[sitemap-packs] 拉取失败，生成空 sitemap:', error instanceof Error ? error.message : error);
  writeFileSync(outputPath, buildSitemap(env.siteUrl, []), 'utf8');
}
