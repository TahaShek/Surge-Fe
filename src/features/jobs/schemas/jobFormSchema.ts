import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string()
    .min(1, "Job title is required")
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title must be less than 100 characters"),
  
  description: z.string()
    .min(1, "Job description is required")
    .min(50, "Job description must be at least 50 characters")
    .max(5000, "Job description must be less than 5000 characters"),
  
  requirements: z.string()
    .min(1, "Requirements are required")
    .min(20, "Requirements must be at least 20 characters")
    .max(2000, "Requirements must be less than 2000 characters"),
  
  responsibilities: z.string()
    .min(1, "Responsibilities are required")
    .min(20, "Responsibilities must be at least 20 characters")
    .max(2000, "Responsibilities must be less than 2000 characters"),
  
  skills: z.array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required")
    .max(15, "Maximum 15 skills allowed"),
  
  jobType: z.enum(["full-time", "part-time", "contract", "freelance", "internship"], {
    required_error: "Job type is required",
  }),
  
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"], {
    required_error: "Experience level is required",
  }),
  
  location: z.string()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  
  jobWorkingType: z.enum(["remote", "on-site", "hybrid"]).default("remote"),
  
  salary: z.object({
    min: z.number()
      .min(0, "Minimum salary must be positive")
      .optional()
      .or(z.nan())
      .transform(val => isNaN(val) ? undefined : val),
    max: z.number()
      .min(0, "Maximum salary must be positive")
      .optional()
      .or(z.nan())
      .transform(val => isNaN(val) ? undefined : val),
    currency: z.string().default("USD"),
  }).refine(
    (data) => {
      if (data.min && data.max) {
        return data.max >= data.min;
      }
      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["max"],
    }
  ).optional().default({ currency: "USD" }),
  
  benefits: z.array(z.string().min(1, "Benefit cannot be empty"))
    .max(10, "Maximum 10 benefits allowed")
    .default([]),
  
  applicationDeadline: z.string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        return new Date(date) > new Date();
      },
      {
        message: "Application deadline must be in the future",
      }
    )
    .or(z.literal("")),
  
  status: z.enum(["draft", "active", "closed", "filled"]).default("draft"),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;