import { axios } from '@/lib/axios';
import type { TalentSeekerFormData } from './types';

/**
 * Talent Seeker API Endpoints
 */
const TS_ENDPOINTS = {
  ME: '/talent-seeker/profile/me',
  GET: '/talent-seeker',
  CREATE: '/talent-seeker/profile',
  UPDATE: '/talent-seeker/profile',
} as const;

class TalentSeekerApiService {
  /**
   * Get current user's talent seeker profile
   */
  async getMyProfile() {
    const response = await axios.get(TS_ENDPOINTS.ME);
    if (response.data?.success) return response.data.data;
    throw new Error('Failed to fetch talent seeker profile');
  }

  /**
   * Create a new talent seeker profile
   */
  async createProfile(payload: TalentSeekerFormData) {
    const response = await axios.post(TS_ENDPOINTS.CREATE, payload);
    return response.data;
  }

  /**
   * Update existing talent seeker profile (upsert)
   */
  async upsertProfile(payload: TalentSeekerFormData | FormData) {
    const isFormData = payload instanceof FormData;
    const response = await axios.put(TS_ENDPOINTS.UPDATE, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    return response.data;
  }
}

export const talentSeekerApi = new TalentSeekerApiService();

export default TalentSeekerApiService;
