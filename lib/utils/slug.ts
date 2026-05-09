export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "project";
}

export function uniqueSlug(base: string, used: Set<string>): string {
  let s = slugify(base);
  let n = 0;
  while (used.has(s)) {
    n += 1;
    s = `${slugify(base)}-${n}`;
  }
  used.add(s);
  return s;
}
