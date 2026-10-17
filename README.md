# Xiyu Wang — Sculpture

A responsive artist portfolio built with Astro and TypeScript. Static HTML pages use small scripts for mobile navigation, material filters and the image viewer. No database, CMS, API keys or external image services are required.

## Development

Use Node.js 22 or later. Run from the repository root:

```sh
npm ci
npm run dev
```

```sh
npm run check   # Astro and TypeScript checks
npm run build   # Generate the deployable site in dist/
npm run preview
```

In the restricted cloud environment, use `npm ci --cache /tmp/xiyu-npm-cache`. The package scripts disable optional Astro telemetry so they do not need to write to the home directory.

## Content

- **`src/data/projects.ts`** — project titles, years, materials, dimensions, descriptions and image sequences. The first project is the home hero; the next three are the home selection. Adding another object creates its archive entry and individual page automatically. Material filters are derived from the projects.
- **`src/data/site.ts`** — biography, working artist statement, Instagram, public email and CV records.
- **`src/styles/global.css`** — typography, spacing and responsive layouts.
- **`src/pages/`** — Home, Works, project template, About, CV, Contact and 404.
- **`public/images/`** — location for real optimized WebP photographs, in three sizes; created by the image helper when needed.

The four current projects are Somira, Four-Gates Pagoda, NIOU and Nezha’s Bike. Somira has artist-verified year, materials, dimensions and description; its photographs are awaiting upload. The other three projects have titles only, with all other details empty. Neutral image areas preserve the layout until real photographs are supplied. The biography, artist statement and CV records are also empty. Add only information supplied or verified by the artist; do not generate artwork details or artist writing.

The public email is intentionally empty. Set `site.email` to activate the email link. Instagram is already linked to `@wxy_wonka`.

### Add an artwork image

Use an original JPEG, PNG or WebP at least 1024 pixels wide; 1600–2400 pixels is recommended for high-density screens. Run from the repository root:

```sh
npm run image -- /path/to/original.jpg my-sculpture
```

This preserves the source, creates three WebP renditions without cropping, and prints an image object to paste into the project’s `images` array. Write meaningful alt text and a short caption. Add as many installation or detail images as needed; image-viewer and caption counts update automatically. Portrait and landscape photographs retain their own proportions.

### Add CV records

Add entries to the relevant section in `cv`, newest first:

```ts
{ year: '2026', title: 'Exhibition title', place: 'Venue, City, Country' }
```

## Deployment and SEO

Deploy `dist/` to any static host. Configure the host to serve `404.html` for missing routes. No server process is required in production.

Set `PUBLIC_SITE_URL` to the final HTTPS origin when building for a real domain:

```sh
PUBLIC_SITE_URL=https://your-real-domain.example npm run build
```

This activates canonical URLs and absolute social-sharing image URLs. The site includes page-specific titles and descriptions, Open Graph metadata, structured artist data and a favicon. No production domain or deployment has been assumed.

## Accessibility and interaction

Keyboard users can skip to the main content, use material filters, open images, move between images with arrow keys, and close the viewer with Escape. The native modal dialog manages focus and restores it to the originating image. Mobile navigation supports Escape. Motion respects `prefers-reduced-motion`.

Once added, images have explicit dimensions and responsive sources. Below-the-fold artwork is lazy-loaded; the first main image loads eagerly. Fonts are served locally, with the license in `public/fonts/LICENSE.txt`.

## English and Chinese content

English keeps its existing routes. Simplified Chinese uses `/zh/`; both render the same components in `src/components/pages/`. The header switcher preserves the equivalent page. Asset URLs remain shared and all page links use the configured Astro base.

- `src/i18n/index.ts`: interface labels, language detection, and page URL helpers.
- `src/data/projects.ts`: shared project facts and image metadata; `getProjects(language)` combines them with localized copy.
- `src/data/text/projects.en.ts`: original verified English titles, materials, descriptions, and image alt text.
- `src/data/text/projects.zh.ts`: verified Chinese project copy, keyed by slug. Add only supplied translations; image alt text is keyed by the existing image `src`.
- `src/data/site.ts`: original English biography, statement, CV records, and shared contact details.
- `src/data/text/site.zh.ts`: optional verified Chinese biography, statement, and CV copy.

Until verified Chinese copy is supplied, Chinese project pages retain English titles, materials, and alt text, and omit descriptions. The Chinese About page omits the untranslated biography and statement. CV records remain in their original English, marked `lang="en"`; only interface headings are localized. Do not machine-translate artist text or duplicate artwork image files to add a language.

Run `npm run check` and `npm run build` after changes. The current build produces 12 English routes, 12 equivalent Chinese routes, and the existing English 404 page. Canonical URLs and reciprocal `en`, `zh-CN`, and `x-default` links include the configured GitHub Pages base path.
