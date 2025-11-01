"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  IJob,
  JobType,
  ExperienceLevel,
  JobWorkingType,
  IJobFilters,
} from "../types/job.types";
import {
  JobTypeLabels,
  ExperienceLevelLabels,
  formatSalary,
  formatTimeAgo,
} from "../types/job.types";
import { jobApi } from "../api/job.api";
import { toast } from "sonner";
import { JobApplicationDialog } from "./JobApplicationDialog";

// Add this type definition if not already present
interface JobApplicationData {
  coverLetter: string;
  resumeFile?: File;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<
    ExperienceLevel[]
  >([]);
  const [selectedWorkingTypes, setSelectedWorkingTypes] = useState<
    JobWorkingType[]
  >([]);
  const [sortBy, setSortBy] = useState<
    "recent" | "salary-high" | "salary-low" | "relevant"
  >("recent");
  const [locationFilter, setLocationFilter] = useState("");
  const [applicationDialog, setApplicationDialog] = useState<{
    isOpen: boolean;
    job: IJob | null;
  }>({
    isOpen: false,
    job: null,
  });
  const [updatingBookmarks, setUpdatingBookmarks] = useState<Set<string>>(
    new Set()
  );

  // Backend enum values
  const jobTypes: JobType[] = [
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
  ];
  const experienceLevels: ExperienceLevel[] = [
    "entry",
    "mid",
    "senior",
    "lead",
  ];
  const workingTypes: JobWorkingType[] = ["remote", "on-site", "hybrid"];

  // Fetch jobs from backend API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);

        // Build filters object for backend
        const filters: IJobFilters = {
          search: searchQuery || undefined,
          jobType: selectedJobTypes.length > 0 ? selectedJobTypes : undefined,
          experienceLevel:
            selectedExperience.length > 0 ? selectedExperience : undefined,
          jobWorkingType:
            selectedWorkingTypes.length > 0 ? selectedWorkingTypes : undefined,
          location: locationFilter || undefined,
          sortBy:
            sortBy === "recent"
              ? "createdAt"
              : sortBy === "salary-high"
              ? "salary"
              : sortBy === "salary-low"
              ? "salary"
              : "relevance",
        };

        console.log("Fetching jobs with filters:", filters);

        const response = await jobApi.getJobs(filters);

        if (response.success && response.data) {
          const jobsData = Array.isArray(response.data)
            ? response.data
            : response.data.jobs || [];
          setJobs(jobsData);
          console.log(`Found ${jobsData.length} jobs`);
        } else {
          setJobs([]);
          toast.error("Failed to load jobs");
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to load jobs");
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Add debounce to search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedJobTypes,
    selectedExperience,
    selectedWorkingTypes,
    sortBy,
    locationFilter,
  ]);

  const toggleFilter = <T extends string>(
    value: T,
    selected: T[],
    setSelected: (val: T[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleOpenApplication = (job: IJob) => {
    setApplicationDialog({
      isOpen: true,
      job,
    });
  };

  const handleCloseApplication = () => {
    setApplicationDialog({
      isOpen: false,
      job: null,
    });
  };

  const handleSubmitApplication = async (
    applicationData: JobApplicationData
  ) => {
    if (!applicationDialog.job) return;

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("coverLetter", applicationData.coverLetter);

      if (applicationData.resumeFile) {
        formData.append("resume", applicationData.resumeFile);
      }

      // Call the API to submit application
      await jobApi.applyToJob(applicationDialog.job._id, formData);

      toast.success("Application submitted successfully!");
      handleCloseApplication();
    } catch (error: any) {
      console.error("Failed to submit application:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit application";
      throw new Error(errorMessage);
    }
  };

  // Update the handleSaveJob function to use API data
  const handleSaveJob = async (
    jobId: string,
    isCurrentlyBookmarked: boolean
  ) => {
    try {
      setUpdatingBookmarks((prev) => new Set(prev).add(jobId));

      if (isCurrentlyBookmarked) {
        await jobApi.unbookmarkJob(jobId);
        toast.success("Job removed from bookmarks");
      } else {
        await jobApi.bookmarkJob(jobId);
        toast.success("Job saved successfully!");
      }

      // Update the local state to reflect the change
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? { ...job, bookmarked: !isCurrentlyBookmarked }
            : job
        )
      );
    } catch (error: any) {
      console.error("Failed to save/unsave job:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update bookmarks";
      toast.error(errorMessage);
    } finally {
      setUpdatingBookmarks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  // Helper to get company name from talentFinderId
  const getCompanyName = (talentFinder: any): string => {
    if (!talentFinder) return "Company";

    if (typeof talentFinder === "string") {
      return "Company";
    }

    // Handle different possible structures
    return (
      talentFinder.companyName ||
      talentFinder.name ||
      talentFinder.username ||
      "Company"
    );
  };

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setSelectedWorkingTypes([]);
    setSearchQuery("");
    setLocationFilter("");
    setSortBy("recent");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as typeof sortBy)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Type Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Job Type</Label>
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`job-type-${type}`}
                        checked={selectedJobTypes.includes(type)}
                        onCheckedChange={() =>
                          toggleFilter(
                            type,
                            selectedJobTypes,
                            setSelectedJobTypes
                          )
                        }
                      />
                      <label
                        htmlFor={`job-type-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {JobTypeLabels[type]}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Experience Level Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Experience Level
                  </Label>
                  {experienceLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`experience-${level}`}
                        checked={selectedExperience.includes(level)}
                        onCheckedChange={() =>
                          toggleFilter(
                            level,
                            selectedExperience,
                            setSelectedExperience
                          )
                        }
                      />
                      <label
                        htmlFor={`experience-${level}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {ExperienceLevelLabels[level]}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Working Type Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Working Type</Label>
                  {workingTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`working-${type}`}
                        checked={selectedWorkingTypes.includes(type)}
                        onCheckedChange={() =>
                          toggleFilter(
                            type,
                            selectedWorkingTypes,
                            setSelectedWorkingTypes
                          )
                        }
                      />
                      <label
                        htmlFor={`working-${type}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent mt-4"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Job Listings */}
          <div className="space-y-4 lg:col-span-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading jobs...
                  </span>
                ) : (
                  <>
                    {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                    {(searchQuery ||
                      selectedJobTypes.length > 0 ||
                      selectedExperience.length > 0 ||
                      selectedWorkingTypes.length > 0 ||
                      locationFilter) &&
                      " with current filters"}
                  </>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => {
                const companyName = getCompanyName(job.talentFinderId);
                // Use the bookmarked field from API response
                const isBookmarked = job.bookmarked || false;
                const isUpdating = updatingBookmarks.has(job._id);

                return (
                  <Card
                    key={job._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="text-base">
                            {companyName}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSaveJob(job._id, isBookmarked)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Bookmark
                              className={`h-5 w-5 ${
                                isBookmarked
                                  ? "fill-current text-blue-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{JobTypeLabels[job.jobType]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="capitalize">
                            {job.jobWorkingType}
                          </span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatSalary(job.salary)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(job.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {job.description}
                      </p>

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 8).map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 8 && (
                            <Badge variant="outline">
                              +{job.skills.length - 8} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {job.benefits && job.benefits.length > 0 && (
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground">
                            Benefits:
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {job.benefits.slice(0, 5).map((benefit, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.applicationDeadline && (
                        <div className="text-xs text-muted-foreground">
                          Application deadline:{" "}
                          {new Date(
                            job.applicationDeadline
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant="outline">
                        {ExperienceLevelLabels[job.experienceLevel]}
                      </Badge>
                      <div className="flex gap-2">
                        {job.applicantsCount > 0 && (
                          <span className="text-xs text-muted-foreground self-center">
                            {job.applicantsCount}{" "}
                            {job.applicantsCount === 1
                              ? "applicant"
                              : "applicants"}
                          </span>
                        )}
                        <Button onClick={() => handleOpenApplication(job)}>
                          Apply Now
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      {applicationDialog.job && (
        <JobApplicationDialog
          isOpen={applicationDialog.isOpen}
          onClose={handleCloseApplication}
          jobId={applicationDialog.job._id}
          jobTitle={applicationDialog.job.title}
          companyName={getCompanyName(applicationDialog.job.talentFinderId)}
          onSubmit={handleSubmitApplication}
        />
      )}
    </div>
  );
}
