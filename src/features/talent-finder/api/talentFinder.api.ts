import type { TalentFinderProfile } from "../types/store";
import { axiosInstance as api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export const talentFinderApi = {
    getMyProfile: async (): Promise<ApiResponse<TalentFinderProfile>> => {
    const response = await api.get("talent-finder/profile/me");
    return response.data;
  },
  getProfile: async (): Promise<ApiResponse<TalentFinderProfile>> => {
    const response = await api.get("talent-finder/profile");
    return response.data;
  },

  upsertProfile: async (profile: TalentFinderProfile): Promise<ApiResponse<TalentFinderProfile>> => {
    const response = await api.post("talent-finder/profile", profile);
    return response.data;
  },
};