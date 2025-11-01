import { create } from 'zustand';
import { talentSeekerApi } from '../talentSeekerApi';
import type { TalentSeekerFormData } from '../types';
import { z } from 'zod';

// Zod schema to validate talent seeker payloads before sending to API
const EducationItemSchema = z.object({
  degree: z.string().optional(),
  institution: z.string().optional(),
  year: z.number().optional().nullable(),
});

const TalentSeekerSchema = z.object({
  title: z.string().optional(),
  bio: z.string().optional(),
  // allow string or array for skills
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  experience: z.number().optional().nullable(),
  education: z.array(EducationItemSchema).optional(),
  portfolio: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  resume: z
  .instanceof(FileList)
  .optional()
  .refine(
    (fileList) => {
      if (!fileList || fileList.length === 0) return true;
      const file = fileList[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(file.type);
    },
    { message: "Only .pdf or .doc/.docx files are allowed" }
  ),
  availability: z.enum(['available', 'not-available', 'open-to-offers']).optional(),
  expectedSalary: z.object({
    min: z.number().optional().nullable(),
    max: z.number().optional().nullable(),
    currency: z.string().optional(),
  }).optional(),
  location: z.string().optional(),
  isOpenToRemote: z.boolean().optional(),
  preferredJobTypes: z.array(z.string()).optional(),
});

type TalentSeeker = z.infer<typeof TalentSeekerSchema>;

interface ITalentSeekerStore {
  profile: TalentSeeker | null;
  isLoading: boolean;
  error: { message: string } | null;
  status: 'idle' | 'loading' | 'loaded' | 'error';
  setProfile: (p: TalentSeeker | null) => void;
  clearError: () => void;
  getProfile: () => Promise<TalentSeeker | null>;
  createProfile: (payload: TalentSeekerFormData) => Promise<any>;
  upsertProfile: (payload: TalentSeekerFormData | FormData) => Promise<any>;
}

export const useTalentSeekerStore = create<ITalentSeekerStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  status: 'idle',

  setProfile: (p) => {
    set({ profile: p, status: p ? 'loaded' : 'idle', error: null });
    if (p) {
      try {
        localStorage.setItem('talentSeekerProfile', JSON.stringify(p));
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.removeItem('talentSeekerProfile');
    }
  },

  clearError: () => set({ error: null }),

  getProfile: async () => {
    try {
      set({ isLoading: true, error: null, status: 'loading' });

      // Try localStorage first for instant ux
      const stored = localStorage.getItem('talentSeekerProfile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          set({ profile: parsed, isLoading: false, status: 'loaded' });
        } catch (e) {
          // ignore parse error
        }
      }

      const res = await talentSeekerApi.getMyProfile();
      // API may wrap data in response.data
      const data = res?.data ?? res;

      // validate with zod (will throw if invalid)
      const validated = TalentSeekerSchema.parse(data);
      set({ profile: validated, isLoading: false, status: 'loaded' });
      try { localStorage.setItem('talentSeekerProfile', JSON.stringify(validated)); } catch (e) {}
      return validated;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch profile';
      set({ error: { message: errorMessage }, isLoading: false, status: 'error' });
      return null;
    }
  },

  createProfile: async (payload) => {
    try {
      set({ isLoading: true, error: null, status: 'loading' });

      // validate payload
      const safe = TalentSeekerSchema.parse(payload as unknown);

      const res = await talentSeekerApi.createProfile(safe as TalentSeekerFormData);
      const responseData = res?.data ?? res;

      // store and return
      const validated = TalentSeekerSchema.parse(responseData);
      set({ profile: validated, isLoading: false, status: 'loaded' });
      try { localStorage.setItem('talentSeekerProfile', JSON.stringify(validated)); } catch (e) {}
      return res;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create profile';
      set({ error: { message: errorMessage }, isLoading: false, status: 'error' });
      throw error;
    }
  },

  upsertProfile: async (payload: TalentSeekerFormData | FormData) => {
  try {
    set({ isLoading: true, error: null, status: "loading" });

    let res;

    // ✅ If the form contains a file, send it as multipart/form-data
    if (payload instanceof FormData) {
      res = await talentSeekerApi.upsertProfile(payload);
    } else {
      // ✅ Otherwise, validate JSON using Zod and send normally
      const safe = TalentSeekerSchema.parse(payload);
      res = await talentSeekerApi.upsertProfile(safe);
    }

    const responseData = res?.data ?? res;

    // Validate response (optional)
    const validated = TalentSeekerSchema.parse(responseData);

    set({
      profile: validated,
      isLoading: false,
      status: "loaded",
    });

    try {
      localStorage.setItem("talentSeekerProfile", JSON.stringify(validated));
    } catch (e) {
      // ignore
    }

    return res;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to save profile";
    set({
      error: { message: errorMessage },
      isLoading: false,
      status: "error",
    });
    throw error;
  }
},

}));

export default useTalentSeekerStore;
