---
title: "Authoring Cheatsheet"
description: "A quick reference for writing Markdown that matches the site's typography and components."
summary: "Front matter, layout conventions, code and data blocks, math, embeds, and accessibility tips for new posts."
pubDate: 2025-11-02
updatedDate: 2025-11-02
tags:
  - writing
  - markdown
  - workflow
order: 100
draft: true
---

Welcome! This note captures the conventions that keep Markdown content consistent across the site. Every section below renders with the same `.md` stylesheet that powers project pages, the experience timeline, and other content collections.

<Icon name="github" size={20} style="vertical-align: middle;" />

> **Need a template fast?** Duplicate this file, update the front matter, and replace the body with your own outline. All headings automatically receive anchored scroll margins so deep-links look tidy inside overlays or standalone pages.

## 1. Required Front Matter

Each post uses YAML front matter. The keys below are supported by the `blog` content collection.

```yaml
---
title: "Descriptive page title"
description: "Short meta description (shows up in cards & head tags)."
summary: "Optional longer teaser used in lists."
pubDate: 2025-10-12
updatedDate: 2025-10-18 # optional, but great for versioned docs
tags:
  - analytics
  - research-notes
draft: false # omit to publish by default
order: 120 # higher number bubbles to the top of listings
---
```

- `description` feeds SEO tags and card blurbs. Keep it <=160 characters.
- `summary` is optional; when present it shows up in list previews.
- `order` controls sort order in listings and is handy for pinned posts.

## 2. Headings, Text, and Chips

### Headings

Use standard Markdown notation. Levels `h2` and `h3` are the sweet spot for section hierarchy.

```markdown
## Research Tracks
### Field Experiments
```

### Emphasis and inline highlights

- `**Bold**` and `_Italic_` map to Golos Text with tuned letter-spacing.
- Keyboard keys or UI chips can use backticks: `Cmd+K`, `tabular-nums`.
- Superscripts and subscripts work via HTML tags: H<sub>2</sub>O, X<sup>2</sup>.

## 3. Lists and Checkboxes

- Plain bullet lists render with comfortable spacing.
  - Nested items inherit the existing line-height.
- Ordered lists keep numeric alignment thanks to tabular numerals.

Task lists are supported out of the box:

- [x] Confirm API contract
- [ ] Wire up integration tests
- [ ] Capture screenshots for docs

## 4. Links and Media

- Inline links: `[Project Brief](https://example.com)`.
- Bare links (autolinks) stay on-brand: `<https://astro.build>`.
- For local anchors, use lowercase slugs: `[Jump to code](#5-code-blocks)`.
- Images adopt rounded corners automatically:

```markdown
![Dashboard prototype](./images/dashboard.png "Optional caption")
```

## 5. Code Blocks

Inline snippets use single backticks. For multi-line examples wrap with triple backticks and name the language to trigger syntax highlighting.

```ts
type LayerConfig = {
  id: string;
  source: "forest" | "transport" | "supply";
  isVisible?: boolean;
};

export const defaultLayers: LayerConfig[] = [
  { id: "habitat-change", source: "forest", isVisible: true },
  { id: "district-flows", source: "transport" },
];
```

> **Tip:** Lines longer than the container scroll horizontally but keep padding so code never hugs the edges.

## 6. Callouts and Quotes

Use blockquotes for callouts. They inherit a soft background and border from `markdown.css`.

> **Tip:** Pair qualitative field notes with data source links. It helps future you remember where each hypothesis came from.

Stacked blockquotes stay readable:

> Primary takeaway.
>
> Secondary note with a link to [documentation](https://developer.mozilla.org/).

## 7. Tables and Tabular Data

Tables automatically scroll on mobile and switch to tabular numerals for alignment.

| Metric        | Definition                            | Example |
| ------------- | -------------------------------------- | ------- |
| `yield_pct`   | Share of total harvest captured        | 47.3%   |
| `drudgery_hr` | Hours saved per collector each season  | 12.6    |
| `traceable`   | Parcels with digital provenance checks | 186     |

## 8. Math & Notation

LaTeX isn't bundled, but inline HTML math works reliably across browsers. Use MathML for clarity.

Inline example:

<math xmlns="http://www.w3.org/1998/Math/MathML">
  <msup>
    <mi>E</mi>
    <mn>2</mn>
  </msup>
  <mo>=</mo>
  <mi>m</mi>
  <msup>
    <mi>c</mi>
    <mn>4</mn>
  </msup>
</math>

Block-level math pairs nicely with a `<figure>` wrapper:

<figure>
  <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
    <mrow>
      <mi>P</mi>
      <mo>(</mo>
      <mi>success</mi>
      <mo>)</mo>
      <mo>=</mo>
      <mfrac>
        <mrow>
          <mi>observed</mi>
          <mo>&#8290;</mo>
          <mi>trials</mi>
        </mrow>
        <mi>total</mi>
      </mfrac>
    </mrow>
  </math>
  <figcaption>Probabilities render crisply using MathML, no extra tooling required.</figcaption>
</figure>

## 9. Embedding Components

MDX is enabled, so you can import lightweight Astro components when needed.

```mdx
import Icon from "@/components/Icon.astro";

<Icon name="github" size={20} style="vertical-align: middle;" /> Project repo
```

Keep components small--anything heavy should stay in dedicated Astro pages.

## 10. Footnotes and Small Print

Footnotes use standard Markdown syntax and render with muted text.

Power-law growth is common in provisioning networks[^1].

[^1]: See the scaling analysis in *Urban Infrastructure and Energy Systems* (2019).

For inline legal or editorial notes, use `<small>`:

<small>Drafts stay private until the `draft` flag is removed or `false`.</small>

---

### Publishing Workflow

1. Create a file in `src/content/blog/`.
2. Adjust front matter fields described above.
3. Run `npm run dev` and visit `/blog/your-slug` for a live preview.
4. Commit and deploy once the content looks good.

Need extra formatting? Drop raw HTML blocks--Astro's Markdown pipeline passes them straight through so long as they are valid.
