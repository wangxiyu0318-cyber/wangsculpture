import type { APIRoute } from "astro";

// Explicitly emit this endpoint into dist/ for static production hosting.
export const prerender = true;

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\n\nSitemap: ${new URL(`${import.meta.env.BASE_URL}sitemap.xml`, site).href}\n`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);
