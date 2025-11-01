export type EducationItem = {
  degree?: string;
  institution?: string;
  year?: number | null;
};

export type TalentSeekerFormData = {
  title?: string;
  bio?: string;
  // UI accepts comma-separated string; API helper may pass string[] after normalization
  skills?: string | string[];
  experience?: number | null;
  education?: EducationItem[];
  portfolio?: string;
  github?: string;
  linkedin?: string;
  
  // 👇 Changed: allow both uploaded file(s) and stored URL
  resume?: string | FileList;

  availability?: "available" | "not-available" | "open-to-offers";
  expectedSalary?: {
    min?: number | null;
    max?: number | null;
    currency?: string;
  };
  location?: string;
  isOpenToRemote?: boolean;
  preferredJobTypes?: string[];
};

export const jobTypeOptions = ["full-time", "part-time", "contract", "freelance"] as const;
