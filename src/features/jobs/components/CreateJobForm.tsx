import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { jobFormSchema, type JobFormValues } from "../schemas/jobFormSchema";
import { jobApi } from "../api/job.api";
import { Button } from "@/components/ui/button";
import {
Form,
FormControl,
FormDescription,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CreateJobFormProps {
initialData?: JobFormValues;
onSubmit?: (data: JobFormValues) => Promise<void>;
submitButtonText?: string;
isEditMode?: boolean;
jobId?: string;
}

export function CreateJobForm({
initialData,
onSubmit,
submitButtonText = "Create Job",
isEditMode = false,
jobId,
}: CreateJobFormProps) {
const navigate = useNavigate();
const [isSubmitting, setIsSubmitting] = useState(false);
const [isPublishing, setIsPublishing] = useState(false);
const [skillInput, setSkillInput] = useState("");
const [benefitInput, setBenefitInput] = useState("");

const form = useForm<JobFormValues>({
  resolver: zodResolver(jobFormSchema),
  defaultValues: initialData || {
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: [],
    jobType: undefined,
    experienceLevel: undefined,
    location: "",
    jobWorkingType: "remote",
    salary: {
      min: undefined,
      max: undefined,
      currency: "USD",
    },
    benefits: [],
    applicationDeadline: "",
    status: "draft",
  },
});

// Common data transformation
const transformFormData = (values: JobFormValues) => {
  return {
    title: values.title,
    description: values.description,
    requirements: values.requirements,
    responsibilities: values.responsibilities,
    skills: values.skills.filter((skill) => skill.trim() !== ""),
    jobType: values.jobType,
    experienceLevel: values.experienceLevel,
    location: values.location || undefined,
    jobWorkingType: values.jobWorkingType,
    salary:
      values.salary?.min || values.salary?.max
        ? {
            min: values.salary.min,
            max: values.salary.max,
            currency: values.salary.currency || "USD",
          }
        : undefined,
    benefits: values.benefits.filter((benefit) => benefit.trim() !== ""),
    applicationDeadline: values.applicationDeadline
      ? new Date(values.applicationDeadline)
      : undefined,
  };
};

const handleSaveDraft = async () => {
  try {
    setIsSubmitting(true);
    const values = form.getValues();

    if (isEditMode && jobId) {
      // Update existing job as draft using the onSubmit prop
      if (onSubmit) {
        await onSubmit({ ...values, status: "draft" });
      } else {
        // Fallback to direct API call if no onSubmit prop
        const updateData = transformFormData(values);
        await jobApi.updateJob(jobId, { ...updateData, status: "draft" });
        toast.success("Draft updated successfully!");
        navigate("/my-jobs");
      }
    } else {
      // Create new job as draft
      const jobData = transformFormData(values);
      const createResponse = await jobApi.createJob(jobData);

      if (createResponse.success) {
        toast.success("Draft saved successfully!");
        navigate("/my-jobs");
      } else {
        throw new Error(createResponse.message || "Failed to save draft");
      }
    }
  } catch (error: any) {
    console.error("Error saving draft:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to save draft. Please try again.";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

const handlePublish = async () => {
  try {
    setIsPublishing(true);
    const values = form.getValues();

    if (isEditMode && jobId) {
      // Update and publish existing job using the onSubmit prop
      if (onSubmit) {
        await onSubmit({ ...values, status: "active" });
      } else {
        // Fallback to direct API call if no onSubmit prop
        const updateData = transformFormData(values);
        await jobApi.updateJob(jobId, { ...updateData, status: "active" });
        toast.success("Job updated and published successfully!");
        navigate("/my-jobs");
      }
    } else {
      // Create new job and publish using the two-step process
      await handleCreateAndPublish();
    }
  } catch (error: any) {
    console.error("Error publishing job:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to publish job. Please try again.";
    toast.error(errorMessage);
  } finally {
    setIsPublishing(false);
  }
};

// For new job creation - the two-step process
const handleCreateAndPublish = async () => {
  try {
    setIsPublishing(true);
    const values = form.getValues();

    // Step 1: Create job as draft
    const jobData = transformFormData(values);
    const createResponse = await jobApi.createJob(jobData);

    if (!createResponse.success) {
      throw new Error(createResponse.message || "Failed to create job");
    }

    // Step 2: Get the created job ID and publish it
    const newJobId = createResponse.data?._id;
    if (!newJobId) {
      throw new Error("Job ID not found in response");
    }

    // Step 3: Publish the job
    const publishResponse = await jobApi.publishJob(
      newJobId,
      values.applicationDeadline
        ? new Date(values.applicationDeadline)
        : undefined
    );

    if (publishResponse.success) {
      toast.success("Job published successfully!");
      navigate("/my-jobs");
    } else {
      throw new Error(publishResponse.message || "Failed to publish job");
    }
  } catch (error: any) {
    console.error("Error publishing job:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to publish job. Please try again.";
    toast.error(errorMessage);
  } finally {
    setIsPublishing(false);
  }
};

const addSkill = () => {
  if (skillInput.trim()) {
    const currentSkills = form.getValues("skills");
    if (currentSkills.length < 15) {
      form.setValue("skills", [...currentSkills, skillInput.trim()]);
      setSkillInput("");
    } else {
      toast.error("Maximum skills reached");
    }
  }
};

const removeSkill = (index: number) => {
  const currentSkills = form.getValues("skills");
  form.setValue(
    "skills",
    currentSkills.filter((_, i) => i !== index)
  );
};

const addBenefit = () => {
  if (benefitInput.trim()) {
    const currentBenefits = form.getValues("benefits");
    if (currentBenefits.length < 10) {
      form.setValue("benefits", [...currentBenefits, benefitInput.trim()]);
      setBenefitInput("");
    } else {
      toast.error("Maximum benefits reached");
    }
  }
};

const removeBenefit = (index: number) => {
  const currentBenefits = form.getValues("benefits");
  form.setValue(
    "benefits",
    currentBenefits.filter((_, i) => i !== index)
  );
};

return (
  <Form {...form}>
    <form className="space-y-8">
      {/* Header showing mode */}

      {/* All your existing form fields remain exactly the same */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the core details about the job position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Senior Frontend Developer"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/100 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of the role..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/5000 characters (minimum 50)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List the qualifications and requirements..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/2000 characters (minimum 20)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsibilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsibilities *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the key responsibilities..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0}/2000 characters (minimum 20)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Specify the job type, level, and work arrangement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobWorkingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select working type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. San Francisco, CA" {...field} />
                  </FormControl>
                  <FormDescription>
                    Required for on-site and hybrid roles
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Benefits</CardTitle>
          <CardDescription>
            Add required skills and offered benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="skills"
            render={() => (
              <FormItem>
                <FormLabel>Required Skills *</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.watch("skills").map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormDescription>
                  {form.watch("skills").length}/15 skills (minimum 1 required)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={() => (
              <FormItem>
                <FormLabel>Benefits</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a benefit..."
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addBenefit}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.watch("benefits").map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormDescription>
                  {form.watch("benefits").length}/10 benefits (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compensation & Timeline</CardTitle>
          <CardDescription>
            Set salary range and application deadline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="salary.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary.currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="applicationDeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Deadline</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </FormControl>
                <FormDescription>
                  Optional - Must be a future date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end gap-4">
        {/* Show different buttons based on mode */}
        {isEditMode ? (
          <>
            {/* For edit mode, only show Update button - no draft option */}
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Job"
              )}
            </Button>
          </>
        ) : (
          <>
            {/* For create mode, show both draft and publish options */}
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting || isPublishing}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
            <Button
              type="button"
              onClick={handleCreateAndPublish}
              disabled={isSubmitting || isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  </Form>
);
}
