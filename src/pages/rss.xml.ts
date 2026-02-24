import { getCollection } from 'astro:content';

const SITE_URL = 'https://shamilkhedgikar.github.io';
const SITE_TITLE = 'Shamil Khedgikar';
const SITE_DESCRIPTION = 'Research, engineering, and geospatial writing.';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const resolveText = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return '';
};

export async function GET() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => {
      const orderDelta = (b.data.order ?? 0) - (a.data.order ?? 0);
      if (orderDelta !== 0) return orderDelta;
      return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    });

  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.slug}/`, SITE_URL).toString();
      const summary = resolveText(post.data.summary, post.data.description, post.data.title);
      return [
        '<item>',
        `<title>${escapeXml(post.data.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${post.data.pubDate.toUTCString()}</pubDate>`,
        `<description>${escapeXml(summary)}</description>`,
        '</item>',
      ].join('');
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

