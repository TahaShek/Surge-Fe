"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jobFormSchema, type JobFormValues } from "../schemas/jobFormSchema"
import { jobApi } from "../api/job.api"
import { CreateJobForm } from "../components/CreateJobForm" // Reuse your existing form
import { toast } from "sonner"

export default function EditJobPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [jobData, setJobData] = useState<JobFormValues | null>(null)

  useEffect(() => {
    if (jobId) {
      fetchJobData(jobId)
    }
  }, [jobId])

  const fetchJobData = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await jobApi.getJobById(id)
      
      if (response) {
        // Transform job data to match form schema
        const formData: JobFormValues = {
          title: response.title,
          description: response.description,
          requirements: response.requirements,
          responsibilities: response.responsibilities,
          skills: response.skills,
          jobType: response.jobType,
          experienceLevel: response.experienceLevel,
          location: response.location || "",
          jobWorkingType: response.jobWorkingType,
          salary: response.salary || {
            min: undefined,
            max: undefined,
            currency: "USD"
          },
          benefits: response.benefits,
          applicationDeadline: response.applicationDeadline 
            ? new Date(response.applicationDeadline).toISOString().slice(0, 16)
            : "",
          status: response.status
        }
        setJobData(formData)
      }
    } catch (error) {
      console.error("Failed to fetch job:", error)
      toast.error("Failed to load job data")
      navigate("/my-jobs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateJob = async (data: JobFormValues) => {
    try {
      if (!jobId) return
      
      const updateData = {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        skills: data.skills.filter(skill => skill.trim() !== ""),
        jobType: data.jobType,
        experienceLevel: data.experienceLevel,
        location: data.location || undefined,
        jobWorkingType: data.jobWorkingType,
        salary: data.salary?.min || data.salary?.max
          ? {
              min: data.salary.min,
              max: data.salary.max,
              currency: data.salary.currency || "USD",
            }
          : undefined,
        benefits: data.benefits.filter(benefit => benefit.trim() !== ""),
        applicationDeadline: data.applicationDeadline
          ? new Date(data.applicationDeadline)
          : undefined,
        status: data.status,
      }

      await jobApi.updateJob(jobId, updateData)
      toast.success("Job updated successfully")
      navigate("/my-jobs")
    } catch (error) {
      console.error("Failed to update job:", error)
      toast.error("Failed to update job")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/my-jobs")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Edit Job Posting</h1>
          <p className="text-muted-foreground mb-8">
            Update your job posting details
          </p>

          {jobData && (
            <CreateJobForm 
              initialData={jobData}
              onSubmit={handleUpdateJob}
              submitButtonText="Update Job"
            />
          )}
        </div>
      </div>
    </div>
  )
}