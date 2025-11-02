# Shamil Khedgikar — Astro Site

This repo powers Shamil Khedgikar's personal site, built with [Astro](https://astro.build/) and a small set of bespoke glassmorphic components. Content is stored in Astro content collections for easy authoring.

## Quick Start

- `npm install` — install dependencies.
- `npm run dev` — start the dev server at <http://localhost:4321/>.
- `npm run build` — produce a production build in `dist/`.
- `npm run preview` — locally preview the production build.

## Content Model

All structured content lives in `src/content` and is validated by `src/content/config.ts`.

### Timeline Entries

- Files: `src/content/timeline/*.md`. Use a `.mdx` suffix only when you need to import components directly.
- Required frontmatter:
  ```yaml
  ---
  title: "Senior Data Scientist (III)"
  role: Senior Data Scientist
  organization: AECOM
  category: Work # one of: Work, Education, Research & Publications, Talks, Awards & Grants
  period: Oct. 2025 – Present
  year: 2025
  order: 110            # optional, higher numbers float to the top within a year
  subtitle: Advisory Services # optional
  links:                 # optional: rendered as icon chips under the card
    - label: Project Repo
      href: https://github.com/...
      icon: github
  ---
  ```
- Available icon names: `github`, `scholar`, `instagram`, `linkedin`, `twitter`, `rss`, `pdf`, `hyperlink`, `blog`, `youtube`.
- Either supply `role`/`organization` or a descriptive `title` – the component auto-selects the best combination.
- Markdown (or MDX) below the frontmatter populates the card body.
- Categories map to colours defined in `src/data/timelineCategories.ts`.
- Use the optional `plumx` object to surface PlumX metrics without MDX — see `2024-groundwater-i.md` for a reference entry.
- **Embeds:** if you need bespoke behaviour beyond the built-in PlumX support, MDX components can be dropped into specific entries.

### Projects

- Files: `src/content/projects/*.md`.
- Frontmatter schema:
  ```yaml
  ---
  title: IndiaPulse@ISB
  summary: Insights on India's economic recovery from curated high-frequency indicators.
  href: https://diri.isb.edu/en/research/india-pulse1.html
  year: 2021
  order: 20                 # optional display priority
  image: ./indiapulse.png   # optional, local to the content file
  imageAlt: IndiaPulse dashboards illustrating economic recovery metrics across India
  technologies:
    - language: Python
      tools: [Streamlit, Dash, GeoPandas, 'scikit-learn']
    - language: R
      tools: [Shiny, Flexdashboard, Crosstalk]
    - language: Spatial Visualization
      tools: [Kepler.gl, deck.gl, 'Unfolded Studio']
  links:
    - label: Repository
      href: https://github.com/example
      icon: github
  ---
  ```
- `year` surfaces beside the project title in the carousel.
- `technologies` drive both the chips displayed on the card and the Technologies filter.
- Optional `links` appear as inline icon buttons inside the expanded card.

### Technologies Filter

- Edit `src/data/skills.ts` to control the chips shown above the carousel. Each entry has the same `language`/`tools` shape as project frontmatter so the filter slugs line up automatically.

### Profile / About

- Main bio copy lives at `src/content/profile/about.md`.
- The bio renders inside `AboutSection.astro`, which handles the collapsible behaviour.

## Components of Interest

- `src/components/ExperienceTimeline.astro` — vertical timeline with internal scrolling and support for link chips.
- `src/components/ProjectsCarousel.astro` — coverflow-inspired carousel with card expansion, filtering, and keyboard interactions.
- `src/components/SkillsCard.astro` — interactive Technologies filter that dispatches selection state to the carousel.
- `src/components/PlumxWidget.astro` — helper for embedding PlumX metrics within MDX content.

## Styling & Interaction Notes

- Global section spacing and anchor offsets live in `src/pages/index.astro`. Adjust `scroll-margin-top` there if the fixed header height changes.
- The timeline viewport uses an internal scroll container; wheel events hand off to the page once you hit the top or bottom edges.
- Carousel arrows are disabled when the track can't scroll further; cards expand/collapse on click or keyboard (`Enter`/`Space`).

## Conventions

- Keep new content files ASCII unless the source text requires otherwise; quote YAML strings that include punctuation such as colons or em dashes.
- Run `npm run build` after changing collection schemas or data files to regenerate content types.
- Avoid committing the `dist/` output; deployments rebuild from source.

Happy mapping!


