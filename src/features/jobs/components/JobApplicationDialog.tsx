
import type React from "react"

import { useState } from "react"
import { Upload, X, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface JobApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
  companyName: string
  onSubmit: (applicationData: JobApplicationData) => Promise<void>
}

export interface JobApplicationData {
  coverLetter: string
  resumeUrl?: string
  resumeFile?: File
}

export function JobApplicationDialog({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onSubmit,
}: JobApplicationDialogProps) {
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    coverLetter?: string
    resume?: string
  }>({})


  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload a PDF or Word document",
        }))
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }))
        return
      }

      setResumeFile(file)
      setErrors((prev) => ({ ...prev, resume: undefined }))
    }
  }

  const handleRemoveFile = () => {
    setResumeFile(null)
    setErrors((prev) => ({ ...prev, resume: undefined }))
  }

  const validateForm = (): boolean => {
    const newErrors: { coverLetter?: string; resume?: string } = {}

    if (!coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required"
    } else if (coverLetter.trim().length < 50) {
      newErrors.coverLetter = "Cover letter must be at least 50 characters long"
    }

    if (!resumeFile) {
      newErrors.resume = "Resume is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting")
      return
    }

    setIsSubmitting(true)

    try {
      const applicationData: JobApplicationData = {
        coverLetter: coverLetter.trim(),
        resumeFile: resumeFile || undefined,
      }

      await onSubmit(applicationData)

      // Reset form
      setCoverLetter("")
      setResumeFile(null)
      setErrors({})
      onClose()
      toast.success("Application submitted successfully!")
    } catch (error: any) {
      console.error("Failed to submit application:", error)
      toast.error(error.message || "Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setCoverLetter("")
      setResumeFile(null)
      setErrors({})
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>Submit your application to {companyName}. All fields are required.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">
              Cover Letter <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're a great fit for this position..."
              value={coverLetter}
              onChange={(e) => {
                setCoverLetter(e.target.value)
                if (errors.coverLetter) {
                  setErrors((prev) => ({ ...prev, coverLetter: undefined }))
                }
              }}
              rows={8}
              className={errors.coverLetter ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.coverLetter && <p className="text-sm text-destructive">{errors.coverLetter}</p>}
            <p className="text-xs text-muted-foreground">{coverLetter.length} characters (minimum 50 required)</p>
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume">
              Resume <span className="text-destructive">*</span>
            </Label>
            {!resumeFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors ${
                  errors.resume ? "border-destructive" : "border-border"
                }`}
              >
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label htmlFor="resume" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Click to upload your resume</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-4 flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{resumeFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} disabled={isSubmitting}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors.resume && <p className="text-sm text-destructive">{errors.resume}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
