# Shamil Khedgikar - Astro Site

This repo powers Shamil Khedgikar's personal site, built with [Astro](https://astro.build/) and a small set of bespoke glassmorphic components. Content is stored in Astro content collections for easy authoring.

## Quick Start

- `npm install` - install dependencies.
- `npm run dev` - start the dev server at <http://localhost:4321/>.
- `npm run check` - run Astro diagnostics.
- `npm run build` - produce a production build in `dist/`.
- `npm run verify` - run diagnostics and a production build in one command.
- `npm run preview` - locally preview the production build.
- `npm run deploy` - manual fallback that builds locally and publishes `dist/` to the `gh-pages` branch.

## Deployment Flow

- Use `npm run dev` while editing locally.
- Run `npm run verify` before pushing when you want a local preflight check.
- Push to `dev` or open a PR to run CI automatically.
- Merge or push to `master` to trigger automatic GitHub Pages deployment.
- `npm run deploy` is now optional and only needed as a manual fallback.

## Dependency Updates

- Dependabot opens weekly PRs for npm dependencies and GitHub Actions updates.
- Review and merge those PRs instead of running `npm update` manually for routine upgrades.
- CI runs on each dependency PR, and a merge to `master` deploys automatically.

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
- Do not commit `dist/`; GitHub Actions builds it during CI and deployment.

Happy mapping!
