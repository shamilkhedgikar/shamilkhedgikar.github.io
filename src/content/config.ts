import type { ImageMetadata } from 'astro';
import { defineCollection, z } from 'astro:content';

const profile = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
  }),
});

const timeline = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    organization: z.string().optional(),
    category: z.enum(['Work', 'Education', 'Research & Publications', 'Talks, Awards & Grants']),
    period: z.string(),
    year: z.number(),
    order: z.number().optional(),
    subtitle: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string().optional(),
          href: z.string().url(),
          icon: z.enum([
            'github',
            'scholar',
            'instagram',
            'linkedin',
            'twitter',
            'rss',
            'pdf',
            'hyperlink',
            'blog',
            'youtube',
          ]).optional(),
        }),
      )
      .optional(),
    plumx: z
      .object({
        href: z.string().url(),
        label: z.string().optional(),
      })
      .optional(),
  }),
});

// src/content/config.ts
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    href: z.string().url(),
    year: z.number().optional(),
    technologies: z
      .array(
        z.object({
          language: z.string(),
          tools: z.array(z.string()).optional(),
        }),
      )
      .optional(),
    order: z.number().optional(),
    image: z.union([z.string(), z.custom<ImageMetadata>()]).optional(),
    imageAlt: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string().optional().nullable(),
          href: z.string().url(),
          icon: z.enum([
            'github',
            'scholar',
            'instagram',
            'linkedin',
            'twitter',
            'rss',
            'pdf',
            'hyperlink',
            'blog',
            'youtube',
          ]).optional(),
        }),
      )
      .optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    heroImage: z.union([z.string(), z.custom<ImageMetadata>()]).optional(),
    heroAlt: z.string().optional(),
    order: z.number().optional(),
  }),
});


export const collections = {
  profile,
  timeline,
  projects,
  blog,
};
