import type { APIRoute } from 'astro';
import { IS_PREVIEW_HOST } from '@/config/site';

export const GET: APIRoute = ({ site }) => {
  if (IS_PREVIEW_HOST) return text('User-agent: *\nDisallow: /\n');
  const sitemap = site ? `\nSitemap: ${new URL('sitemap-index.xml', site).href}\n` : '';
  return text(`User-agent: *\nAllow: /\n${sitemap}`);
};

const text = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
