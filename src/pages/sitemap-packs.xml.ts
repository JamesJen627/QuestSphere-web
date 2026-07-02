export const prerender = false;

import { listPublicPackIds } from '../lib/supabase';

export async function GET() {
  const site = import.meta.env.PUBLIC_SITE_URL ?? 'https://questsphere-web.vercel.app';

  let packIds: string[] = [];
  try {
    packIds = await listPublicPackIds();
  } catch {
    packIds = [];
  }

  const urls = packIds
    .map(
      (packId) => `  <url>
    <loc>${site}/pack/${packId}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
