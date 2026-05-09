export type ProjectCategory =
  | "web_app"
  | "mobile"
  | "fintech"
  | "ai_ml"
  | "iot"
  | "data_science"
  | "education"
  | "utils"
  | "blockchain"
  | "security"
  | "e_commerce"
  | "other";

export type ProjectStatus =
  | "active"
  | "maintained"
  | "looking_for_maintainers"
  | "archived";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  full_description: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  github_url: string | null;
  gitlab_url: string | null;
  demo_url: string | null;
  license: string | null;
  contributing_url: string | null;
  key_features: string | null;
  stack: string[];
  stars_count: number;
  forks_count: number;
  open_issues_count: number;
  primary_language: string | null;
  last_activity_at: string | null;
  submitted_by: string;
  is_published: boolean;
  is_official: boolean;
  version_label: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectContributorRow = {
  id: string;
  project_id: string;
  display_name: string;
  email: string | null;
  role: string | null;
  profile_id: string | null;
  sort_order: number;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Profile>;
      };
      projects: {
        Row: ProjectRow;
        Insert: Omit<
          ProjectRow,
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProjectRow>;
      };
      project_contributors: {
        Row: ProjectContributorRow;
        Insert: Omit<ProjectContributorRow, "id"> & { id?: string };
        Update: Partial<ProjectContributorRow>;
      };
    };
  };
};
