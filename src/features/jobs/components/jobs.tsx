"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Briefcase, DollarSign, Clock, Bookmark, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { IJob, JobType, ExperienceLevel, JobWorkingType } from "../types/job.types"
import { 
  JobTypeLabels, 
  ExperienceLevelLabels, 
  formatSalary, 
  formatTimeAgo 
} from "../types/job.types"
import { jobApi } from "../api/job.api"
import { mockJobs } from "../mocks/mock-jobs"

export default function JobsPage() {
  const [jobs, setJobs] = useState<IJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([])
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel[]>([])
  const [selectedWorkingTypes, setSelectedWorkingTypes] = useState<JobWorkingType[]>([])
  const [salaryRange, setSalaryRange] = useState([15, 40])
  const [sortBy, setSortBy] = useState<"recent" | "salary-high" | "salary-low" | "relevant">("recent")

  // Backend enum values
  const jobTypes: JobType[] = ["full-time", "part-time", "internship", "contract", "freelance"]
  const experienceLevels: ExperienceLevel[] = ["entry", "mid", "senior", "lead"]
  const workingTypes: JobWorkingType[] = ["remote", "on-site", "hybrid"]

  // Filter jobs from mock data (simulating API call)
  useEffect(() => {
    const filterJobs = () => {
      setIsLoading(true)
      
      // Simulate API delay
      setTimeout(() => {
        let filtered = [...mockJobs]

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (job) =>
              job.title.toLowerCase().includes(query) ||
              job.description.toLowerCase().includes(query) ||
              (typeof job.talentFinderId === 'object' && 
               job.talentFinderId.companyName?.toLowerCase().includes(query)) ||
              job.skills.some((skill) => skill.toLowerCase().includes(query))
          )
        }

        // Filter by job type
        if (selectedJobTypes.length > 0) {
          filtered = filtered.filter((job) => selectedJobTypes.includes(job.jobType))
        }

        // Filter by experience level
        if (selectedExperience.length > 0) {
          filtered = filtered.filter((job) => selectedExperience.includes(job.experienceLevel))
        }

        // Filter by working type
        if (selectedWorkingTypes.length > 0) {
          filtered = filtered.filter((job) => selectedWorkingTypes.includes(job.jobWorkingType))
        }

        // Filter by salary range
        filtered = filtered.filter((job) => {
          if (!job.salary) return true
          const min = job.salary.min || 0
          const max = job.salary.max || Infinity
          return (min >= salaryRange[0] && min <= salaryRange[1]) ||
                 (max >= salaryRange[0] && max <= salaryRange[1]) ||
                 (min <= salaryRange[0] && max >= salaryRange[1])
        })

        // Sort jobs
        if (sortBy === "recent") {
          filtered.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        } else if (sortBy === "salary-high") {
          filtered.sort((a, b) => {
            const aMax = a.salary?.max || 0
            const bMax = b.salary?.max || 0
            return bMax - aMax
          })
        } else if (sortBy === "salary-low") {
          filtered.sort((a, b) => {
            const aMin = a.salary?.min || 0
            const bMin = b.salary?.min || 0
            return aMin - bMin
          })
        }
        // "relevant" sort would require backend logic, using recent as default

        setJobs(filtered)
        setIsLoading(false)
      }, 300) // Simulate network delay
    }

    filterJobs()
  }, [searchQuery, selectedJobTypes, selectedExperience, selectedWorkingTypes, salaryRange, sortBy])

  const toggleFilter = <T extends string>(
    value: T,
    selected: T[],
    setSelected: (val: T[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const handleApply = async (jobId: string) => {
    try {
      await jobApi.applyToJob(jobId, {})
      // TODO: Show success toast/notification
      console.log("Application submitted successfully")
    } catch (error) {
      console.error("Failed to apply:", error)
      // TODO: Show error toast/notification
    }
  }

  const handleSaveJob = async (jobId: string, isSaved: boolean) => {
    try {
      if (isSaved) {
        await jobApi.unsaveJob(jobId)
      } else {
        await jobApi.saveJob(jobId)
      }
      // TODO: Update local state or refetch
    } catch (error) {
      console.error("Failed to save/unsave job:", error)
    }
  }

  // Helper to get company name from talentFinderId
  const getCompanyName = (talentFinder: string | { name?: string; companyName?: string }): string => {
    if (typeof talentFinder === "string") {
      return "Company"
    }
    return talentFinder.companyName || talentFinder.name || "Company"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
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
                        id={type}
                        checked={selectedJobTypes.includes(type)}
                        onCheckedChange={() => toggleFilter(type, selectedJobTypes, setSelectedJobTypes)}
                      />
                      <label
                        htmlFor={type}
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
                  <Label className="text-sm font-semibold">Experience Level</Label>
                  {experienceLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={selectedExperience.includes(level)}
                        onCheckedChange={() => toggleFilter(level, selectedExperience, setSelectedExperience)}
                      />
                      <label
                        htmlFor={level}
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
                        id={type}
                        checked={selectedWorkingTypes.includes(type)}
                        onCheckedChange={() => toggleFilter(type, selectedWorkingTypes, setSelectedWorkingTypes)}
                      />
                      <label
                        htmlFor={type}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Salary Range Filter */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Hourly Rate</Label>
                  <div className="space-y-2">
                    <Slider
                      min={10}
                      max={100}
                      step={5}
                      value={salaryRange}
                      onValueChange={setSalaryRange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${salaryRange[0]}/hr</span>
                      <span>${salaryRange[1]}/hr</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedJobTypes([])
                    setSelectedExperience([])
                    setSelectedWorkingTypes([])
                    setSalaryRange([15, 40])
                    setSearchQuery("")
                  }}
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
                  </>
                )}
              </p>
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Loading jobs...</h3>
                </CardContent>
              </Card>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Try adjusting your filters or search query
                  </p>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => {
                const companyName = getCompanyName(job.talentFinderId)
                const isSaved = false // TODO: Track saved jobs state
                
                return (
                  <Card key={job._id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription className="text-base">{companyName}</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleSaveJob(job._id, isSaved)}
                        >
                          <Bookmark 
                            className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} 
                          />
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
                          <span>{formatTimeAgo(job.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{job.description}</p>
                      
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {job.requirements.length > 0 && (
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground">Requirements:</Label>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                            {job.requirements.slice(0, 3).map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                            {job.requirements.length > 3 && (
                              <li className="text-xs">+{job.requirements.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {job.benefits.length > 0 && (
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground">Benefits:</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {job.benefits.slice(0, 5).map((benefit, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.applicationDeadline && (
                        <div className="text-xs text-muted-foreground">
                          Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
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
                            {job.applicantsCount} {job.applicantsCount === 1 ? "applicant" : "applicants"}
                          </span>
                        )}
                        <Button onClick={() => handleApply(job._id)}>
                          Apply Now
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
