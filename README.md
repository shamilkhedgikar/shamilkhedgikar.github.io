# Shamil Khedgikar - Astro Site

This repo powers Shamil Khedgikar's personal site, built with [Astro](https://astro.build/) and a small set of bespoke glassmorphic components. Content is stored in Astro content collections for easy authoring.

## Quick Start

- `npm install` - install dependencies.
- `npm run dev` - start the dev server at <http://localhost:4321/>.
- `npm run check` - run Astro diagnostics.
- `npm run build` - produce a production build in `dist/`.
- `npm run verify` - run diagnostics and a production build in one command.
- `npm run prepare:deploy` - write deployment metadata and a generated `README.md` into `dist/` for the `master` branch.
- `npm run preview` - locally preview the production build.
- `npm run deploy` - build locally and publish `dist/` directly to the `master` branch.

## Analytics and Crawlers

- Add your GA4 measurement ID to a local `.env` file using `.env.example` as the template.
- Use `PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.
- Analytics is loaded through `/ga-config.js`, so the same ID reaches Astro pages and the legacy static `public/IndiaPulse_kg.html` file.
- `robots.txt` is generated at build time from `src/pages/robots.txt.ts`.

## Deployment Flow

- `dev` is the source branch. Keep Astro code, content, and workflows there.
- `master` is the static output branch. It should contain the generated site only.
- Use `npm run dev` while editing locally on `dev`.
- Run `npm run verify` before pushing when you want a local preflight check.
- Push to `dev` or open a PR to run CI automatically.
- When you want to publish, run `npm run deploy` from `dev`. That builds `dist/`, writes deployment metadata, generates a branch-specific `README.md`, and pushes the generated site to `master`.
- Configure GitHub Pages to publish from the `master` branch root, not from GitHub Actions.

## Dependency Updates

- Dependabot opens weekly PRs for npm dependencies and GitHub Actions updates.
- Dependency PRs target `dev`, which is the source branch.
- Review and merge those PRs instead of running `npm update` manually for routine upgrades.
- After merging to `dev`, publish separately with `npm run deploy` when you are ready.

## Content Model

All structured content lives in `src/content` and is validated by `src/content/config.ts`.

### Timeline Entries (`src/content/timeline/*.md`)

- Required fields: `title`, `category`, `period`, `year`.
- Optional fields: `role`, `organization`, `order`, `subtitle`, `links`, `plumx`.
- `category` must be one of:
- `Work`, `Education`, `Research & Publications`, `Talks, Awards & Grants`.
- `links[].icon` options:
- `github`, `scholar`, `instagram`, `linkedin`, `twitter`, `rss`, `pdf`, `hyperlink`, `blog`, `youtube`.
- Markdown content under frontmatter is rendered inside the timeline details body.
- Empty or missing `subtitle` is safely ignored (no error, no empty subtitle line).
- Timeline-only typography behavior: body markdown text and hyperlinks are styled to match subtitle tone in the timeline component.
- Use optional `plumx` for citation metrics embeds:

```yaml
plumx:
  href: https://plu.mx/plum/a/?doi=...
  label: View PlumX metrics and citations
```

Example:

```yaml
---
title: Senior Data Scientist - AECOM
role: Senior Data Scientist
organization: AECOM
category: Work
period: Oct. 2025 - Present
year: 2025
order: 110
subtitle: Advisory Services - Washington, D.C.
links:
  - label: AECOM Advisory
    href: https://aecom.com/advisory/
    icon: hyperlink
---
[AECOM Advisory](https://aecom.com/advisory/)
```

### Projects (`src/content/projects/*.md`)

- Required fields: `title`, `summary`.
- Optional fields: `href`, `year`, `technologies`, `order`, `image`, `imageAlt`, `links`.
- `links[].href` accepts external URLs and root-relative paths (for example `/rss.xml`).
- `links[].icon` options:
- `github`, `scholar`, `instagram`, `linkedin`, `twitter`, `rss`, `pdf`, `hyperlink`, `blog`, `youtube`, `knowledge-graph`.
- `technologies` drives both the per-project chips and the `SkillsCard` filter mapping.
- Interaction note: project cards open modal details on card click/tap; there is no separate `Details` button.

Example:

```yaml
---
title: IndiaPulse@ISB
summary: Insights on India's economic recovery from curated high-frequency indicators.
href: https://diri.isb.edu/en/research/india-pulse1.html
year: 2021
order: 20
image: ./indiapulse.png
imageAlt: IndiaPulse dashboards illustrating economic recovery metrics across India
technologies:
  - language: Python
    tools: [Streamlit, Dash, GeoPandas, scikit-learn]
links:
  - label: Repository
    href: https://github.com/example
    icon: github
---
```

### Blog Posts (`src/content/blog/*.md`)

- Required fields: `title`, `pubDate`.
- Optional fields: `description`, `summary`, `updatedDate`, `tags`, `draft`, `heroImage`, `heroAlt`, `order`.
- Draft behavior:
- `draft: true` hides a post from homepage, blog index, slug routes, and RSS.
- `draft: false` (or omission) publishes it.

Example:

```yaml
---
title: Sampling Geospatial Primitives
pubDate: 2026-02-24
draft: true
tags: [geospatial, methods]
---
```

### Profile / About (`src/content/profile/about.md`)

- Schema supports optional `title` in frontmatter.
- Body markdown renders in `AboutSection.astro`.

### Technologies Filter

- Edit `src/data/skills.ts` to control chips shown above the projects carousel.
- Keep `language` names aligned with project technology labels for filter matching.

## Components of Interest

- `src/components/ExperienceTimeline.astro` - timeline grouping, subtitle normalization, details rendering, and link chips.
- `src/components/ProjectsCarousel.astro` - carousel, modal overlay flow, and project card rendering.
- `src/components/SkillsCard.astro` - technology filter UI that dispatches selection state.
- `src/components/PlumxWidget.astro` - helper for PlumX embeds inside timeline details.

## Styling and Interaction Notes

- Global section spacing and anchor offsets live in `src/pages/index.astro`.
- Timeline viewport uses an internal scroll container; wheel events hand off to page scroll at boundaries.
- On small screens (`max-width: 720px`), timeline details are hidden for compact cards.
- Projects carousel arrows disable when the track cannot scroll further.

## Conventions

- Keep new content files ASCII unless source text requires otherwise.
- Quote YAML strings that include punctuation-heavy values.
- Run `npm run check` after schema/content-collection changes.
- Do not commit `dist/` to `dev`; `npm run deploy` publishes the built output to `master`.

Happy mapping!
