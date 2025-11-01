export type EducationItem = {
  degree?: string;
  institution?: string;
  year?: number | null;
};

// src/features/talent-seeker/types/index.ts
export interface TalentSeekerFormData {
  title: string;
  bio: string;
  skills: string;
  experience?: number;
  education: Education[];
  portfolio?: string;
  github?: string;
  linkedin?: string;
  resume?: File | string | FileList | null; // Handle both file and existing URL
  availability: "available" | "open-to-offers" | "not-available";
  expectedSalary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  location: string;
  isOpenToRemote: boolean;
  preferredJobTypes: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year?: number;
}

export interface TalentSeekerProfile {
  _id: string;
  userId: string;
  title: string;
  bio: string;
  skills: string[];
  experience?: number;
  education: Education[];
  portfolio?: string;
  github?: string;
  linkedin?: string;
  resume?: string; // URL to uploaded resume
  availability: "available" | "open-to-offers" | "not-available";
  expectedSalary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  location: string;
  isOpenToRemote: boolean;
  preferredJobTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export const jobTypeOptions = ["full-time", "part-time", "contract", "freelance"] as const;
