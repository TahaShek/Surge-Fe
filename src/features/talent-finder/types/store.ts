import type { ApiResponse } from "@/types/api";
import type { z } from "zod";
import type { talentFinderProfileSchema } from "../schemas/talentFinderFormSchema";

export type TalentFinderProfile = z.infer<typeof talentFinderProfileSchema>;

export interface TalentFinderStoreState {
  profile: TalentFinderProfile | null;
  getProfile: () => Promise<void>;
  getMyProfile: () => Promise<void>;
  upsertProfile: (profile: TalentFinderProfile) => Promise<ApiResponse<TalentFinderProfile>>;
}