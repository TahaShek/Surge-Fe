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
import { Separator } from "@/components/ui/separator";
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

  useEffect(() => {
    fetchMyJobs();
  }, [selectedStatus]);

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call to get recruiter's jobs
      // For now, using mock data or you can modify jobApi to include getMyJobs
      const response = await jobApi.getJobs({
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
      // TODO: Implement delete job API call
      // await jobApi.deleteJob(jobId)
      toast.success("Job deleted successfully");
      fetchMyJobs(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job");
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Job Posts</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track your job postings
            </p>
          </div>
          <Button onClick={() => navigate("/jobs/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Jobs", count: statusCounts.all },
            { key: "draft", label: "Drafts", count: statusCounts.draft },
            { key: "active", label: "Active", count: statusCounts.active },
            { key: "closed", label: "Closed", count: statusCounts.closed },
            { key: "filled", label: "Filled", count: statusCounts.filled },
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={selectedStatus === key ? "default" : "outline"}
              onClick={() => setSelectedStatus(key)}
              className="whitespace-nowrap"
            >
              {label}
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            </Button>
          ))}
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
              <Button onClick={() => navigate("/create-job")}>
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
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>
                        Posted {formatTimeAgo(job.createdAt)}
                        {job.applicationDeadline && (
                          <>
                            {" • "}
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Closes{" "}
                            {new Date(
                              job.applicationDeadline
                            ).toLocaleDateString()}
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAnalytics(job._id)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplicants(job._id)}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Applicants ({job.applicantsCount || 0})
                      </Button>
                    </div>
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
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>Views: {job.viewsCount || 0}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary">
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

                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{ExperienceLevelLabels[job.experienceLevel]}</span>
                    <span className="capitalize">{job.jobWorkingType}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditJob(job._id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteJob(job._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
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
