export type UserRole = "grower" | "admin";
export type SeedAdminStatus = "active" | "mature" | "approved_for_buyback";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type SeedSpecies = {
  id: string;
  plant_name: string;
  code_prefix: string;
  buyback_period_weeks: number;
  seed_price: number;
  full_buyback_price: number;
  difficulty_level: DifficultyLevel;
  environment_preferences: string;
  created_at?: string;
};

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
  species_id: string | null;
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
  /** Matched library species (prefix + catalogue name), if any */
  library_species_label: string | null;
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
  seed_species: SeedSpecies | null;
};

export type BuyerInquiryStatus = "new" | "in_review" | "contacted";

export type BuyerInquiry = {
  id: string;
  full_name: string;
  email: string;
  order_details: string;
  status: BuyerInquiryStatus;
  created_at: string;
};
