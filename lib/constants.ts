import type { ProjectCategory, ProjectStatus } from "@/lib/types/database";

export const CATEGORY_OPTIONS: {
  value: ProjectCategory;
  label: string;
}[] = [
  { value: "web_app", label: "Web App" },
  { value: "mobile", label: "Mobile" },
  { value: "fintech", label: "Fintech" },
  { value: "ai_ml", label: "AI/ML" },
  { value: "iot", label: "IoT" },
  { value: "data_science", label: "Data Science" },
  { value: "education", label: "Education" },
  { value: "utils", label: "Utils" },
  { value: "blockchain", label: "Blockchain" },
  { value: "security", label: "Security" },
  { value: "e_commerce", label: "E-commerce" },
  { value: "other", label: "Other" },
];

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "maintained", label: "Maintained" },
  { value: "looking_for_maintainers", label: "Looking for Maintainers" },
  { value: "archived", label: "Archived" },
];

export const TECH_PRESETS: string[] = [
  "JavaScript",
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "Node.js",
  "Vue.js",
  "Django",
  "FastAPI",
  "Java",
  "Go",
  "Rust",
  "Flutter",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "PyTorch",
  "TensorFlow",
];

export function categoryLabel(c: ProjectCategory): string {
  return CATEGORY_OPTIONS.find((x) => x.value === c)?.label ?? c;
}

export function statusLabel(s: ProjectStatus): string {
  return STATUS_OPTIONS.find((x) => x.value === s)?.label ?? s;
}
