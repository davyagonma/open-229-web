import { z } from "zod";

const category = z.enum([
  "web_app",
  "mobile",
  "fintech",
  "ai_ml",
  "iot",
  "data_science",
  "education",
  "utils",
  "blockchain",
  "security",
  "e_commerce",
  "other",
]);

const status = z.enum([
  "active",
  "maintained",
  "looking_for_maintainers",
  "archived",
]);

const optionalUrl = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z.union([z.string().url(), z.null()]).optional()
);

const contributorIn = z.object({
  display_name: z.string().min(1).max(200),
  role: z.string().max(100).optional().nullable(),
  profile_id: z.string().uuid().optional().nullable(),
});

export const projectCreateSchema = z.object({
  name: z.string().min(2).max(200),
  short_description: z.string().min(10).max(400),
  full_description: z.string().optional().nullable(),
  category,
  status: status.default("active"),
  github_url: optionalUrl,
  gitlab_url: optionalUrl,
  demo_url: optionalUrl,
  license: z.string().max(80).optional().nullable(),
  contributing_url: optionalUrl,
  key_features: z.string().max(2000).optional().nullable(),
  stack: z.array(z.string().min(1).max(80)).max(40).default([]),
  stars_count: z.number().int().min(0).max(1_000_000).optional(),
  forks_count: z.number().int().min(0).max(1_000_000).optional(),
  version_label: z.string().max(40).optional().nullable(),
  is_published: z.boolean().optional().default(true),
  contributors: z
    .array(contributorIn)
    .max(50)
    .optional()
    .default([]),
});

export const projectUpdateSchema = projectCreateSchema.partial();

const sortEnum = z.enum([
  "most_stars",
  "recently_updated",
  "trending",
  "most_contributors",
]);

export const projectListQuerySchema = z.object({
  q: z.string().max(200).optional(),
  category: category.optional(),
  sort: sortEnum.default("most_stars"),
  min_stars: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(50).default(12),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
