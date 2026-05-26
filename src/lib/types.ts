export type UserRole = "grower" | "admin";
export type SeedAdminStatus = "active" | "mature" | "approved_for_buyback";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
};

export type Seed = {
  id: string;
  user_id: string;
  seed_code: string;
  plant_name: string;
  registered_at: string;
  next_due_at: string;
  admin_status: SeedAdminStatus;
};

export type AdminSeedRow = {
  id: string;
  seed_code: string;
  plant_name: string;
  registered_at: string;
  admin_status: SeedAdminStatus;
  grower_name: string | null;
  grower_email: string | null;
  check_in_count: number;
};

export type LeafColor = "green" | "yellow" | "brown";
export type PestsAnswer = "yes" | "no" | "other";

export type GrowthReport = {
  id: string;
  seed_id: string;
  user_id: string;
  height_cm: number | null;
  notes: string | null;
  photo_path: string | null;
  has_sprouted: boolean;
  leaf_color: LeafColor | null;
  pests: PestsAnswer | null;
  pests_other: string | null;
  submitted_at: string;
  period_start: string;
  period_end: string;
};

export type Notification = {
  id: string;
  user_id: string;
  seed_id: string | null;
  type: "missed_form" | "form_due_soon" | "info";
  message: string;
  read: boolean;
  created_at: string;
};

export type SeedWithProgress = Seed & {
  reports: GrowthReport[];
  report_count: number;
  status: "on_track" | "due_soon" | "overdue";
  days_until_due: number;
  period_complete: boolean;
};
