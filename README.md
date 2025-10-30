# Shamil Khedgikar — Astro Site

This repo powers the personal site built with [Astro](https://astro.build/). Content is managed through Markdown collections and rendered with bespoke glassmorphic components.

## Quick Start

- `npm install` — install dependencies.
- `npm run dev` — start the dev server on <http://localhost:4321/>.
- `npm run build` — produce a production build in `dist/`.
- `npm run preview` — preview the production build locally.

## Content Model

Content lives under `src/content` and is validated by `src/content/config.ts`.

### Timeline Entries

- Files: `src/content/timeline/*.md`.
- Required frontmatter:
  ```yaml
  ---
  title: Your Title - Your Organizatgion
  # Or
  role: Your Title
  organization: Your Organization
  category: Work # one of: Work, Research, Talks & Awards, Education, Publications
  period: Nov. 2023 – Sept. 2025 # For multi-year positions or specific dates
  year: 2025 # period to reference against timeline
  order: 100 # larger numbers float to the top within a year (optional)
  subtitle: # optional details
  ---
  ```
- `role` and `organization` drive the text inside each card header. `title` remains as a general descriptor/fallback for indexing and can differ from what appears in the UI.
- You can safely use punctuation (including colons `:`) in `role`/`organization`; wrap the value in quotes (`"..."`) or use multi-line block syntax (`>-`) whenever YAML would otherwise misinterpret the text.
- Markdown content below the frontmatter populates the card body. Lists and links are supported out of the box.
- Categories pick up colours from `src/data/timelineCategories.ts`. Add new categories there before referencing them in frontmatter.

### Projects

- Files: `src/content/projects/*.md` (Astro content collection).
- Fields: `title`, `summary`, `href`, `stack[]`, and optional `order` to control carousel sorting.
- The `ProjectsCarousel` component automatically renders Atlas-style tags for each stack item.

### Profile / About

- Main bio: `src/content/profile/about.md`.
- The bio collapses by default; the toggle state is retained client-side via progressive enhancement.

## Components of Interest

- `src/components/ExperienceTimeline.astro` — vertical timeline with constrained internal scroll so the surrounding layout stays compact. The component now prefers explicit `role`/`organization` data instead of splitting strings.
- `src/components/ProjectsCarousel.astro` — coverflow-inspired horizontal carousel with glass cards and keyboard-friendly navigation.
- `src/components/SkillsCard.astro` — renders Technologies tags sourced from `src/data/skills.ts`.

## Styling Notes

- Global layout paddings and anchor offsets live in `src/pages/index.astro`. Adjust `scroll-margin-top` there if header height changes.
- The timeline viewport uses an internal scroll container (`.timeline-viewport`) with `overscroll-behavior: contain;` so mouse-wheel gestures over surrounding whitespace still move the timeline without nudging the page.

## Conventions

- Keep new content files ASCII unless the source text requires otherwise.
- Run `npm run build` after structural changes (collection schema, data files) to ensure the content pipeline stays in sync.
- Avoid committing generated `dist/` output; deployment is handled separately.

Happy mapping!
*** End Patch
