import * as z from "zod"

export const companySizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
] as const;

const baseSchema = z.object({
  company: z.string().min(1, "Company name is required").max(100),
  companySize: z.enum(companySizeOptions).optional(),
  industry: z.string().min(1, "Industry is required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  location: z.string().min(1, "Location is required"),
  isVerifiedCompany: z.boolean().default(false),
});

export const talentFinderFormSchema = baseSchema;

export type TalentFinderFormSchema = z.infer<typeof baseSchema>;

export const talentFinderProfileSchema = baseSchema.extend({
  userId: z.string().optional(),
});

export type TalentFinderFormValues = z.infer<typeof talentFinderFormSchema>