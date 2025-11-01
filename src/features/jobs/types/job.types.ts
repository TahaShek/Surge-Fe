/**
 * Job Types
 * TypeScript interfaces matching the backend schema
 */

/**
 * Job Type Enum
 */
export type JobType = "full-time" | "part-time" | "contract" | "freelance" | "internship";

/**
 * Experience Level Enum
 */
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";

/**
 * Job Working Type Enum
 */
export type JobWorkingType = "remote" | "on-site" | "hybrid";

/**
 * Job Status Enum
 */
export type JobStatus = "draft" | "active" | "closed" | "filled";

/**
 * Salary Structure
 */
export interface ISalary {
  min?: number;
  max?: number;
  currency?: string;
}

/**
 * Talent Finder (Company/Employer) Info
 */
export interface ITalentFinder {
  _id: string;
  name?: string;
  companyName?: string;
  email?: string;
  // Add other fields as needed
}

/**
 * Main Job Interface (matches backend schema)
 */
export interface IJob {
  _id: string;
  talentFinderId: string | ITalentFinder;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  location?: string;
  jobWorkingType: JobWorkingType;
  salary?: ISalary;
  benefits: string[];
  applicationDeadline?: string | Date;
  status: JobStatus;
  applicantsCount: number;
  viewsCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Job Response from API
 */
export interface IJobResponse {
  success: boolean;
  message: string;
  data: IJob | IJob[];
  count?: number;
}

/**
 * Job Filter Parameters
 */
export interface IJobFilters {
  search?: string;
  jobType?: JobType[];
  experienceLevel?: ExperienceLevel[];
  jobWorkingType?: JobWorkingType[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  status?: JobStatus[];
  talentFinderId?: string;
  page?: number;
  limit?: number;
  sortBy?: "recent" | "salary-high" | "salary-low" | "relevant";
}

/**
 * Job Application Interface
 */
export interface IJobApplication {
  _id: string;
  jobId: string;
  userId: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  appliedAt: string | Date;
  resume?: string;
  coverLetter?: string;
}

/**
 * Helper type for displaying job type in UI
 */
export const JobTypeLabels: Record<JobType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};

/**
 * Helper type for displaying experience level in UI
 */
export const ExperienceLevelLabels: Record<ExperienceLevel, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior Level",
  lead: "Lead/Expert",
};

/**
 * Helper function to format salary for display
 */
export const formatSalary = (salary?: ISalary): string => {
  if (!salary) return "Not specified";
  
  const currency = salary.currency || "USD";
  const symbol = currency === "USD" ? "$" : currency;
  
  if (salary.min && salary.max) {
    return `${symbol}${salary.min}-${symbol}${salary.max}/hr`;
  } else if (salary.min) {
    return `${symbol}${salary.min}+/hr`;
  } else if (salary.max) {
    return `Up to ${symbol}${salary.max}/hr`;
  }
  
  return "Not specified";
};

/**
 * Helper function to format time ago
 */
export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

