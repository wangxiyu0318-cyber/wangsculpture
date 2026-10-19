import type { APIRoute } from "astro";
import { projects } from "../data/projects";

// Explicitly emit this endpoint into dist/ for static production hosting.
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const paths = ["", "works/", "about/", "cv/", "contact/", ...projects.map((project) => `works/${project.slug}/`)];
  const urls = ["", "zh/"].flatMap((language) => paths.map((path) => new URL(`${import.meta.env.BASE_URL}${language}${path}`, site).href));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
