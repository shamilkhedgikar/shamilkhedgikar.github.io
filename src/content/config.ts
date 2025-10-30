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
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    href: z.string().url(),
    stack: z.array(z.string()),
    order: z.number().optional(),
    image: z
      .union([
        z.string(),
        z.object({
          src: z.string(),
          alt: z.string().optional(),
        }),
      ])
      .optional(),
  }),
});

export const collections = {
  profile,
  timeline,
  projects,
};
