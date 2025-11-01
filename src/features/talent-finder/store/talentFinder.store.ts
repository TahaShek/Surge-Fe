import type { TalentFinderProfile, TalentFinderStoreState } from "../types/store";
import { create } from "zustand";
import { talentFinderApi } from "../api/talentFinder.api";

export const useTalentFinderStore = create<TalentFinderStoreState>((set) => ({
  profile: null,

  getMyProfile: async () => {
    try {
      const response = await talentFinderApi.getMyProfile();
      if (response.success) {
        set({ profile: response.data });
      }
    } catch (error) {
      console.error("Failed to fetch talent finder profile:", error);
    }
  },

  getProfile: async () => {
    try {
      const response = await talentFinderApi.getProfile();
      if (response.success) {
        set({ profile: response.data });
      }
    } catch (error) {
      console.error("Failed to fetch talent finder profile:", error);
    }
  },

  upsertProfile: async (profile: TalentFinderProfile) => {
    try {
      const response = await talentFinderApi.upsertProfile(profile);
      if (response.success) {
        set({ profile: response.data });
      }
      return response;
    } catch (error) {
      console.error("Failed to update talent finder profile:", error);
      throw error;
    }
  },
}));