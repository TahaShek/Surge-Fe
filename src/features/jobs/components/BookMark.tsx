// components/jobs/BookmarksPage.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Bookmark,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  JobTypeLabels,
  ExperienceLevelLabels,
  formatSalary,
  formatTimeAgo,
} from "../types/job.types";
import { jobApi } from "../api/job.api";
import { toast } from "sonner";
import { JobApplicationDialog } from "./JobApplicationDialog";
import type { IJob } from "../types/job.types";

interface BookmarkedJob {
  _id: string;
  jobId: IJob;
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationDialog, setApplicationDialog] = useState<{
    isOpen: boolean;
    job: IJob | null;
  }>({
    isOpen: false,
    job: null,
  });

  // Fetch bookmarked jobs
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const response = await jobApi.getBookmarkedJobs();

        if (response.success && response.data) {
          const bookmarksData = response.data.bookmarks || [];
          setBookmarks(bookmarksData);
        } else {
          setBookmarks([]);
          toast.error("Failed to load bookmarked jobs");
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        toast.error("Failed to load bookmarked jobs");
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (jobId: string) => {
    try {
      await jobApi.unbookmarkJob(jobId);
      setBookmarks((prev) =>
        prev.filter((bookmark) => bookmark.jobId._id !== jobId)
      );
      toast.success("Job removed from bookmarks");
    } catch (error: any) {
      console.error("Failed to remove bookmark:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove bookmark";
      toast.error(errorMessage);
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

  const handleSubmitApplication = async (applicationData: any) => {
    if (!applicationDialog.job) return;

    try {
      const formData = new FormData();
      formData.append("coverLetter", applicationData.coverLetter);

      if (applicationData.resumeFile) {
        formData.append("resume", applicationData.resumeFile);
      }

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

  // Helper to get company name from talentFinderId
  const getCompanyName = (talentFinder: any): string => {
    if (!talentFinder) return "Company";
    if (typeof talentFinder === "string") return "Company";
    return (
      talentFinder.companyName ||
      talentFinder.company ||
      talentFinder.name ||
      "Company"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Saved Jobs</h1>
          </div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Saved Jobs</h1>
              <p className="text-muted-foreground mt-1">
                {bookmarks.length} {bookmarks.length === 1 ? "job" : "jobs"}{" "}
                bookmarked
              </p>
            </div>
          </div>
        </div>

        {/* Bookmarked Jobs List */}
        {bookmarks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookmarked jobs</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Jobs you save will appear here. Start browsing and save jobs
                that interest you!
              </p>
              <Button onClick={() => (window.location.href = "/jobs")}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => {
              const job = bookmark.jobId;
              const companyName = getCompanyName(job.talentFinderId);

              return (
                <Card
                  key={bookmark._id}
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
                        onClick={() => handleRemoveBookmark(job._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Bookmark className="h-5 w-5 fill-current" />
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
                        <span className="capitalize">{job.jobWorkingType}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Saved {formatTimeAgo(bookmark.createdAt)}</span>
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

                    {job.applicationDeadline && (
                      <div className="text-xs text-muted-foreground">
                        Application deadline:{" "}
                        {new Date(job.applicationDeadline).toLocaleDateString()}
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
            })}
          </div>
        )}
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
