"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  Users,
  Calendar,
  Briefcase,
  MapPin,
  DollarSign,
  Loader2,
  BarChart3,
  CheckCircle,
  Filter,
  Menu,
  X,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jobApi } from "../api/job.api";
import type { IJob } from "../types/job.types";
import {
  JobTypeLabels,
  ExperienceLevelLabels,
  formatSalary,
  formatTimeAgo,
} from "../types/job.types";
import { toast } from "sonner";

export default function MyJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [updatingJobId, setUpdatinappgJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyJobs();
  }, [selectedStatus]);

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobApi.getMyJobs({
        status: selectedStatus === "all" ? undefined : [selectedStatus],
      });

      if (response.success && response.data) {
        const jobsData = Array.isArray(response.data)
          ? response.data
          : response.data.jobs || [];
        setJobs(jobsData);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load your jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await jobApi.deleteJob(jobId);
      toast.success("Job deleted successfully");
      fetchMyJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job");
    }
  };

  const handleMarkAsFilled = async (jobId: string) => {
    if (
      !confirm(
        "Mark this job as filled? This will close the job posting and stop receiving applications."
      )
    )
      return;

    try {
      setUpdatingJobId(jobId);
      await jobApi.updateJob(jobId, { status: "filled" });
      toast.success("Job marked as filled successfully");
      fetchMyJobs();
    } catch (error: any) {
      console.error("Failed to mark job as filled:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to mark job as filled";
      toast.error(errorMessage);
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handleViewApplicants = (jobId: string) => {
    navigate(`/applicants/${jobId}`);
  };

  const handleViewAnalytics = (jobId: string) => {
    navigate(`/analytics/${jobId}`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      filled: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const statusCounts = {
    all: jobs.length,
    draft: jobs.filter((job) => job.status === "draft").length,
    active: jobs.filter((job) => job.status === "active").length,
    closed: jobs.filter((job) => job.status === "closed").length,
    filled: jobs.filter((job) => job.status === "filled").length,
  };

  const statusFilters = [
    { key: "all", label: "All Jobs", count: statusCounts.all },
    { key: "draft", label: "Drafts", count: statusCounts.draft },
    { key: "active", label: "Active", count: statusCounts.active },
    { key: "filled", label: "Filled", count: statusCounts.filled },
  ];

  // Show filled button only for active jobs (not drafts)
  const canMarkAsFilled = (job: IJob) => {
    return job.status === "active";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">My Job Posts</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track your job postings
            </p>
          </div>
          <Button
            onClick={() => navigate("/jobs/create")}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </div>

        {/* Mobile Filter Button */}
        <div className="sm:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full justify-between"
          >
            <span>Filter by Status</span>
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Status Filter */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } sm:flex gap-2 mb-6 overflow-x-auto pb-2`}
        >
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {statusFilters.map(({ key, label, count }) => (
              <Button
                key={key}
                variant={selectedStatus === key ? "default" : "outline"}
                onClick={() => {
                  setSelectedStatus(key);
                  setIsMobileMenuOpen(false);
                }}
                className="justify-between sm:justify-center"
              >
                <span className="flex-1 text-left sm:text-center">{label}</span>
                <Badge variant="secondary" className="ml-2 sm:ml-2">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {selectedStatus === "all"
                  ? "You haven't posted any jobs yet"
                  : `No ${selectedStatus} jobs found`}
              </p>
              <Button onClick={() => navigate("/jobs/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <CardTitle className="text-xl break-words">
                          {job.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span>Posted {formatTimeAgo(job.createdAt)}</span>
                        {job.applicationDeadline && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Closes{" "}
                              {new Date(
                                job.applicationDeadline
                              ).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAnalytics(job._id)}
                        className="justify-center"
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Analytics</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplicants(job._id)}
                        className="justify-center"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Applicants</span>
                        <Badge variant="secondary" className="ml-1">
                          {job.applicantsCount || 0}
                        </Badge>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm text-muted-foreground">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="break-words">{job.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <span>{JobTypeLabels[job.jobType]}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 flex-shrink-0" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 flex-shrink-0" />
                      <span>Views: {job.viewsCount || 0}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed line-clamp-2 break-words">
                    {job.description}
                  </p>

                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="break-words"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 5 && (
                        <Badge variant="outline">
                          +{job.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground w-full sm:w-auto">
                    <span>{ExperienceLevelLabels[job.experienceLevel]}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="capitalize">{job.jobWorkingType}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Action buttons for mobile - dropdown */}
                    <div className="sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            Actions
                            <Menu className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem
                            onClick={() => handleEditJob(job._id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {canMarkAsFilled(job) && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsFilled(job._id)}
                              disabled={updatingJobId === job._id}
                            >
                              {updatingJobId === job._id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              {updatingJobId === job._id
                                ? "Marking..."
                                : "Mark as Filled"}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleViewApplicants(job._id)}
                            className="text-blue-600"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteJob(job._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Action buttons for desktop */}
                    <div className="hidden sm:flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditJob(job._id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      {/* Mark as Filled button - only for active jobs */}
                      {canMarkAsFilled(job) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsFilled(job._id)}
                          disabled={updatingJobId === job._id}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        >
                          {updatingJobId === job._id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          {updatingJobId === job._id
                            ? "Marking..."
                            : "Mark Filled"}
                        </Button>
                      )}

                      {/* Delete button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
