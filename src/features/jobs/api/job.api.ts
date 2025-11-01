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
  CREATE_JOB: "/job/create", // Changed from JOBS to CREATE_JOB
  PUBLISH_JOB: (id: string) => `/job/publish/${id}`, // Updated to match your route
  JOBS: "/job", // For getting jobs
  JOB_BY_ID: (id: string) => `/job/${id}`,
  APPLY: (id: string) => `/job/${id}/apply`,
  APPLICATIONS: "/job/applications",
  SAVED_JOBS: "/job/saved",
  SAVE_JOB: (id: string) => `/job/${id}/save`,
  UNSAVE_JOB: (id: string) => `/job/${id}/unsave`,
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
      JOB_ENDPOINTS.CREATE_JOB, // Using CREATE_JOB endpoint
      jobData
    );
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
      JOB_ENDPOINTS.PUBLISH_JOB(jobId), // Using PUBLISH_JOB endpoint
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
    if (filters?.salaryMin)
      params.append("salaryMin", filters.salaryMin.toString());
    if (filters?.salaryMax)
      params.append("salaryMax", filters.salaryMax.toString());
    if (filters?.status?.length) {
      filters.status.forEach((status) => params.append("status", status));
    }
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);

    const response = await axios.get<IJobResponse>(
      `${JOB_ENDPOINTS.JOBS}?${params.toString()}`
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
   * Apply to a job
   */
  async applyToJob(
    jobId: string,
    data: { resume?: string; coverLetter?: string }
  ): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      JOB_ENDPOINTS.APPLY(jobId),
      data
    );
    return response.data;
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

  async getMyJobs(filters?: IJobFilters): Promise<IJobResponse> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.status?.length) {
      filters.status.forEach((status) => params.append("status", status));
    }
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await axios.get<IJobResponse>(
      `${JOB_ENDPOINTS.JOBS}/my-jobs?${params.toString()}`
    );
    return response.data;
  }


  async updateJob(jobId: string, jobData: Partial<IJob>): Promise<IJobResponse> {
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

  async unsaveJob(jobId: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(
      JOB_ENDPOINTS.UNSAVE_JOB(jobId)
    );
    return response.data;
  }
}

// Export singleton instance
export const jobApi = new JobApiService();

// Export class for testing
export default JobApiService;
