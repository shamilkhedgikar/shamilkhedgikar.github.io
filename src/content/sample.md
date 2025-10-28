# H1 — Heading

This page exercises the Markdown styles. Jump to: [Links](#links) · [Lists](#lists) · [Code](#code) · [Tables](#tables) · [Images](#images) · [Blockquotes](#blockquotes)

Intro paragraph with some **bold**, *italic*, and **_bold italic_**. Inline `code` and an internal link to [Tables](#tables).

## H2 — Subheading

A sentence with a long unbroken URL to test wrapping:
<https://example.com/some/really/long/path/that/keeps/going/to/test/overflow/behavior?with=query&and=more>

### H3 — Sub-subheading

Numbers: 1, 2, 3. Zero vs O: 0 O. Superscript and subscript: 
X<sup>2</sup>,
H<sub>2</sub>O. <small> Small note text.</small>

#### H4

#### H5

###### H6

---

## Links

- Inline external: [Example](https://example.com)
- Inline internal (fragment): [Back to top](#markdown-ui-test)
- Mail/phone: [email me](mailto:hello@example.com), [call](tel:+12025550123)
- Reference-style: see the [docs][docs-link].

[docs-link]: https://developer.mozilla.org/

---

## Lists

### Unordered

- First item with a [link](https://example.com).

- Second item
  - Nested item A
  - Nested item B

### Ordered

1. Step one

2. Step two
   1. Substep
   2. Substep

### Task list (GFM)

- [x] Checked task
- [ ] Unchecked task
- [ ] Task with **bold** and `code`

---

## Code

Inline: Use `tabular-nums` in CSS for 2023, 2024, 2025.

```js
// JavaScript (syntax highlight + long line to test horizontal scroll)
const data = Array.from({length: 10}, (_, i) => ({ id: i, value: Math.random().toString(36).slice(2) })).map(o => ({ ...o, label: `row-${o.id}-${o.value}` }));
console.log("Rows:", data);