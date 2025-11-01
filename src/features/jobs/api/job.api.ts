/**
 * Job API Service
 * Handles all job-related API calls
 */

import { axios } from "@/lib/axios";
import type { IJob, IJobResponse, IJobFilters } from "../types/job.types";

/**
 * Job API Endpoints - Updated to match your backend routes
 */
const JOB_ENDPOINTS = {
  CREATE_JOB: "/job/create",
  PUBLISH_JOB: (id: string) => `/job/publish/${id}`,
  JOBS: "/job",
  JOB_BY_ID: (id: string) => `/job/${id}`,
  APPLY: (id: string) => `/job/${id}/apply`,
  APPLICATIONS: "/job/applications",
  SAVED_JOBS: "/job/saved",
  SAVE_JOB: (id: string) => `/job/${id}/save`,
  UNSAVE_JOB: (id: string) => `/job/${id}/unsave`,
  BOOKMARKS: "/job/bookmarks",
  BOOKMARK_JOB: (id: string) => `/job/${id}/bookmark`,
  UNBOOKMARK_JOB: (id: string) => `/job/${id}/bookmark`,
  APPLIED_CANDIDATES: (id: string) => `/job/${id}/applied-candidates`,
  UPDATE_CANDIDATE_STATUS: (candidateId: string) =>
    `/job/${candidateId}/update-status`, // Fixed - candidateId in URL
  ENHANCE_DESCRIPTION: "/job/enhance-description",

  RECOMMENDATIONS: "/job/recommendations",
  INTERVIEW_QUESTIONS: (applicationId: string) =>
    `/job/applications/${applicationId}/interview-questions`,
  MATCH_SCORE: (id: string) => `/job/${id}/match-score`,
  MY_JOBS: "/job/my-jobs",
} as const;

/**
 * Job API Service Class
 */
class JobApiService {
  /**
   * Create a new job (always creates as draft)
   */
  async createJob(
    jobData: Omit<
      IJob,
      | "_id"
      | "createdAt"
      | "updatedAt"
      | "applicantsCount"
      | "viewsCount"
      | "jobCode"
    >
  ): Promise<IJobResponse> {
    const response = await axios.post<IJobResponse>(
      JOB_ENDPOINTS.CREATE_JOB,
      jobData
    );
    return response.data;
  }

  async updateCandidateStatus(
    jobId: string, // This parameter is not used in the URL, but keep it for consistency
    candidateId: string,
    status: string
  ): Promise<{ message: string }> {
    const response = await axios.put(
      JOB_ENDPOINTS.UPDATE_CANDIDATE_STATUS(candidateId), // candidateId in URL
      { status } // Only status in body
    );
    return response.data;
  }

  async generateInterviewQuestions(applicationId: string): Promise<any> {
    const response = await axios.get(
      JOB_ENDPOINTS.INTERVIEW_QUESTIONS(applicationId)
    );
    return response.data;
  }
  async enhanceJobDescription(data: any): Promise<any> {
    const response = await axios.post(JOB_ENDPOINTS.ENHANCE_DESCRIPTION, data);
    return response.data;
  }
  /**
   * Publish a draft job
   */
  async publishJob(
    jobId: string,
    applicationDeadline?: Date
  ): Promise<IJobResponse> {
    const publishData: { applicationDeadline?: string } = {};

    if (applicationDeadline) {
      publishData.applicationDeadline = applicationDeadline.toISOString();
    }

    const response = await axios.post<IJobResponse>(
      JOB_ENDPOINTS.PUBLISH_JOB(jobId),
      publishData
    );
    return response.data;
  }

  /**
   * Get all jobs with optional filters
   */
  async getJobs(filters?: IJobFilters): Promise<IJobResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);

    // Convert arrays to comma-separated strings for backend validation
    if (filters?.jobType?.length) {
      params.append("jobType", filters.jobType.join(","));
    }
    if (filters?.experienceLevel?.length) {
      params.append("experienceLevel", filters.experienceLevel.join(","));
    }
    if (filters?.jobWorkingType?.length) {
      params.append("jobWorkingType", filters.jobWorkingType.join(","));
    }
    if (filters?.location) params.append("location", filters.location);
    if (filters?.salaryMin)
      params.append("salaryMin", filters.salaryMin.toString());
    if (filters?.salaryMax)
      params.append("salaryMax", filters.salaryMax.toString());
    if (filters?.status?.length) {
      params.append("status", filters.status.join(","));
    }
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);

    const url = `${JOB_ENDPOINTS.JOBS}?${params.toString()}`;
    console.log("Fetching jobs from:", url);

    const response = await axios.get<IJobResponse>(url);
    return response.data;
  }

  /**
   * Get my jobs with optional filters
   */
  async getMyJobs(filters?: IJobFilters): Promise<IJobResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);

    // Handle array parameters correctly for my-jobs endpoint too
    if (filters?.jobType?.length) {
      filters.jobType.forEach((type) => params.append("jobType", type));
    }
    if (filters?.experienceLevel?.length) {
      filters.experienceLevel.forEach((level) =>
        params.append("experienceLevel", level)
      );
    }
    if (filters?.jobWorkingType?.length) {
      filters.jobWorkingType.forEach((type) =>
        params.append("jobWorkingType", type)
      );
    }
    if (filters?.location) params.append("location", filters.location);
    if (filters?.status?.length) {
      filters.status.forEach((status) => params.append("status", status));
    }
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const url = `${JOB_ENDPOINTS.MY_JOBS}?${params.toString()}`;
    console.log("Fetching my jobs from:", url);

    const response = await axios.get<IJobResponse>(url);
    return response.data;
  }

  /**
   * Apply to a job with resume upload
   */
  async applyToJob(
    jobId: string,
    formData: FormData
  ): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      JOB_ENDPOINTS.APPLY(jobId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Get a single job by ID
   */
  async getJobById(id: string): Promise<IJob> {
    const response = await axios.get<IJobResponse>(JOB_ENDPOINTS.JOB_BY_ID(id));
    if (response.data.success && response.data.data) {
      return Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;
    }
    throw new Error("Failed to fetch job");
  }

  /**
   * Get user's job applications
   */
  async getApplications(): Promise<IJobResponse> {
    const response = await axios.get<IJobResponse>(JOB_ENDPOINTS.APPLICATIONS);
    return response.data;
  }

  /**
   * Get saved jobs
   */
  async getSavedJobs(): Promise<IJobResponse> {
    const response = await axios.get<IJobResponse>(JOB_ENDPOINTS.SAVED_JOBS);
    return response.data;
  }

  /**
   * Save a job
   */
  async saveJob(jobId: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      JOB_ENDPOINTS.SAVE_JOB(jobId)
    );
    return response.data;
  }

  /**
   * Unsave a job
   */
  async unsaveJob(jobId: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(
      JOB_ENDPOINTS.UNSAVE_JOB(jobId)
    );
    return response.data;
  }

  /**
   * Update a job
   */
  async updateJob(
    jobId: string,
    jobData: Partial<IJob>
  ): Promise<IJobResponse> {
    const response = await axios.put<IJobResponse>(
      JOB_ENDPOINTS.JOB_BY_ID(jobId),
      jobData
    );
    return response.data;
  }

  /**
   * Delete a job
   */
  async deleteJob(jobId: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(
      `/job/delete/${jobId}`
    );
    return response.data;
  }

  /**
   * Get bookmarked jobs
   */
  async getBookmarkedJobs(filters?: IJobFilters): Promise<IJobResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const url = `${JOB_ENDPOINTS.BOOKMARKS}?${params.toString()}`;
    const response = await axios.get<IJobResponse>(url);
    return response.data;
  }

  /**
   * Get applied candidates for a job
   */
  async getAppliedCandidates(jobId: string): Promise<any> {
    const response = await axios.get(JOB_ENDPOINTS.APPLIED_CANDIDATES(jobId));
    return response.data;
  }

  /**
   * Bookmark a job
   */
  async bookmarkJob(jobId: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      JOB_ENDPOINTS.BOOKMARK_JOB(jobId)
    );
    return response.data;
  }

  /**
   * Unbookmark a job
   */
  async unbookmarkJob(jobId: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(
      JOB_ENDPOINTS.UNBOOKMARK_JOB(jobId)
    );
    return response.data;
  }

  /**
   * Get recommended jobs
   */
  async getRecommendedJobs(filters?: IJobFilters): Promise<IJobResponse> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const url = `${JOB_ENDPOINTS.RECOMMENDATIONS}?${params.toString()}`;
    const response = await axios.get<IJobResponse>(url);
    return response.data;
  }

  /**
   * Get match score for a job
   */
  async getMatchScore(jobId: string): Promise<any> {
    const response = await axios.get(JOB_ENDPOINTS.MATCH_SCORE(jobId));
    return response.data;
  }
}

// Export singleton instance
export const jobApi = new JobApiService();

// Export class for testing
export default JobApiService;
