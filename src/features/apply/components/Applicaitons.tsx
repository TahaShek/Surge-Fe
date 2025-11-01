// components/jobs/ApplicantsPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Award,
  GraduationCap,
  Briefcase,
  Loader2,
  ArrowLeft,
  BookOpen,
  Star,
  DownloadCloud,
  ChevronDown,
  Users,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Brain,
  Target,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jobApi } from "../../jobs/api/job.api";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface Candidate {
  _id: string;
  talentSeekerId: {
    _id: string;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
    };
    skills: string[];
    education: any[];
    resume?: string;
    expectedSalary?: {
      currency: string;
    };
    availability?: string;
    isOpenToRemote?: boolean;
    preferredJobTypes?: any[];
  };
  coverLetter?: string;
  resumeUrl?: string;
  status: string;
  appliedAt: string;
}

interface JobDetails {
  _id: string;
  title: string;
  company: string;
}

interface InterviewQuestions {
  technicalQuestions: string[];
  behavioralQuestions: string[];
  situationalQuestions: string[];
  skillGapQuestions: string[];
  cultureQuestions: string[];
}

// Define the status types based on your backend
type CandidateStatus =
  | "applied"
  | "shortlisted"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "hired";

// Interview Questions Component
const InterviewQuestionsSection: React.FC<{
  applicationId: string;
  jobTitle: string;
  candidateName: string;
  onClose: () => void;
}> = ({ applicationId, jobTitle, candidateName, onClose }) => {
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobApi.generateInterviewQuestions(applicationId);
      setQuestions(response.data.questions);
      toast.success("Interview questions generated successfully!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to generate interview questions";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const QuestionSection: React.FC<{
    title: string;
    questions: string[];
    icon: React.ReactNode;
    color: string;
  }> = ({ title, questions, icon, color }) => {
    if (!questions || questions.length === 0) return null;

    return (
      <Card>
        <CardHeader className={`pb-3 ${color}`}>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="secondary" className="ml-auto">
              {questions.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {questions.map((question, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span className="flex-1">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Interview Questions</h3>
          <p className="text-sm text-muted-foreground">
            Personalized questions for {candidateName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchQuestions}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4" />
            )}
            {loading ? "Generating..." : "Get Suggestions"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {questions && (
        <div className="space-y-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Job:</span> {jobTitle}
                </div>
                <div>
                  <span className="font-medium">Candidate:</span>{" "}
                  {candidateName}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <QuestionSection
              title="Technical Questions"
              questions={questions.technicalQuestions}
              icon={<Brain className="h-4 w-4" />}
              color="text-blue-600"
            />

            <QuestionSection
              title="Behavioral Questions"
              questions={questions.behavioralQuestions}
              icon={<Users className="h-4 w-4" />}
              color="text-green-600"
            />

            <QuestionSection
              title="Situational Questions"
              questions={questions.situationalQuestions}
              icon={<Target className="h-4 w-4" />}
              color="text-purple-600"
            />

            <QuestionSection
              title="Skill Gap Questions"
              questions={questions.skillGapQuestions}
              icon={<Star className="h-4 w-4" />}
              color="text-amber-600"
            />

            <QuestionSection
              title="Culture Fit Questions"
              questions={questions.cultureQuestions}
              icon={<Users className="h-4 w-4" />}
              color="text-indigo-600"
            />
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                <p>
                  <strong>Pro Tip:</strong> These questions are AI-generated
                  based on the job requirements and candidate profile. Use them
                  as a starting point for your interview preparation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default function ApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [showInterviewQuestions, setShowInterviewQuestions] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Fetching applicants for job:", jobId);

      const response = await jobApi.getAppliedCandidates(jobId!);
      console.log("📡 API Response:", response);

      if (response.success && response.data) {
        console.log("✅ Candidates data:", response.data);
        setCandidates(response.data);
      } else {
        setCandidates([]);
        toast.error("Failed to load applicants");
      }
    } catch (error) {
      console.error("❌ Failed to fetch applicants:", error);
      toast.error("Failed to load applicants");
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const job = await jobApi.getJobById(jobId!);
      setJobDetails({
        _id: job._id,
        title: job.title,
        company: job.company || "Company",
      });
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  };

  const handleUpdateStatus = async (
    candidateId: string,
    status: CandidateStatus
  ) => {
    try {
      setUpdatingStatus(candidateId);

      // Call the API to update candidate status
      await jobApi.updateCandidateStatus(jobId!, candidateId, status);

      toast.success(`Candidate ${getStatusActionText(status)} successfully`);

      // Update local state
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === candidateId ? { ...candidate, status } : candidate
        )
      );

      // Update selected candidate if viewing their profile
      if (selectedCandidate?._id === candidateId) {
        setSelectedCandidate((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (error: any) {
      console.error("Failed to update status:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update candidate status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDownloadResume = async (candidate: Candidate) => {
    try {
      const resumeUrl = candidate.resumeUrl || candidate.talentSeekerId.resume;
      if (!resumeUrl) {
        toast.error("No resume available for this candidate");
        return;
      }

      window.open(resumeUrl, "_blank");
    } catch (error: any) {
      console.error("Failed to download resume:", error);
      toast.error("Failed to download resume");
    }
  };

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowInterviewQuestions(false);
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
    setShowInterviewQuestions(false);
  };

  const handleShowInterviewQuestions = () => {
    setShowInterviewQuestions(true);
  };

  const handleCloseInterviewQuestions = () => {
    setShowInterviewQuestions(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800 border-blue-200",
      shortlisted: "bg-purple-100 text-purple-800 border-purple-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      applied: Clock,
      reviewed: Eye,
      shortlisted: Star,
      rejected: XCircle,
      accepted: CheckCircle,
      hired: Users,
      withdrawn: ThumbsDown,
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const getStatusActionText = (status: CandidateStatus): string => {
    const actions = {
      applied: "marked as applied",
      reviewed: "marked as reviewed",
      shortlisted: "shortlisted",
      accepted: "accepted",
      rejected: "rejected",
      hired: "hired",
      withdrawn: "marked as withdrawn",
    };
    return actions[status];
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const user = candidate.talentSeekerId.userId;
    const matchesSearch =
      searchQuery === "" ||
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || candidate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Quick action buttons for common status updates
  const quickActions = [
    {
      status: "shortlisted" as CandidateStatus,
      label: "Shortlist",
      icon: Star,
      variant: "outline" as const,
    },
    {
      status: "accepted" as CandidateStatus,
      label: "Accept",
      icon: CheckCircle,
      variant: "default" as const,
    },
    {
      status: "rejected" as CandidateStatus,
      label: "Reject",
      icon: XCircle,
      variant: "destructive" as const,
    },
  ];

  // Candidate Detail View
  if (selectedCandidate) {
    const candidate = selectedCandidate;
    const seeker = candidate.talentSeekerId;
    const user = seeker.userId;
    const StatusIcon = getStatusIcon(candidate.status);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applicants
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Candidate Profile</h1>
              <p className="text-muted-foreground">
                {jobDetails?.title} • {jobDetails?.company}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Candidate Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-lg">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="text-xl font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge
                        className={`mt-2 ${getStatusColor(candidate.status)}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {candidate.status.charAt(0).toUpperCase() +
                          candidate.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      {seeker.availability && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">
                            {seeker.availability}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Applied {formatDate(candidate.appliedAt)}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-2 w-full">
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action) => {
                          const ActionIcon = action.icon;
                          return (
                            <Button
                              key={action.status}
                              variant={action.variant}
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(candidate._id, action.status)
                              }
                              disabled={updatingStatus === candidate._id}
                              className="flex items-center gap-1"
                            >
                              {updatingStatus === candidate._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ActionIcon className="h-3 w-3" />
                              )}
                              {action.label}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDownloadResume(candidate)}
                      >
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Download Resume
                      </Button>

                      {/* Get Interview Questions Button */}
                      <Button
                        onClick={handleShowInterviewQuestions}
                        className="w-full"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Get Interview Questions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              {seeker.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {seeker.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {showInterviewQuestions ? (
                <InterviewQuestionsSection
                  applicationId={candidate._id}
                  jobTitle={jobDetails?.title || "Job"}
                  candidateName={`${user.firstName} ${user.lastName}`}
                  onClose={handleCloseInterviewQuestions}
                />
              ) : (
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Candidate Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Full Name
                            </Label>
                            <p className="text-sm">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Email</Label>
                            <p className="text-sm">{user.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Availability
                            </Label>
                            <p className="text-sm capitalize">
                              {seeker.availability || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Remote Work
                            </Label>
                            <p className="text-sm">
                              {seeker.isOpenToRemote ? "Yes" : "No"}
                            </p>
                          </div>
                          {seeker.expectedSalary?.currency && (
                            <div>
                              <Label className="text-sm font-medium">
                                Salary Currency
                              </Label>
                              <p className="text-sm">
                                {seeker.expectedSalary.currency}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Cover Letter Tab */}
                  <TabsContent value="cover-letter">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cover Letter</CardTitle>
                        <CardDescription>
                          Applied on {formatDate(candidate.appliedAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {candidate.coverLetter ? (
                          <div className="prose max-w-none">
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                              {candidate.coverLetter}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4" />
                            <p>No cover letter provided</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your existing code for the main applicants list view remains the same...
  // [Keep all the existing code for the main list view below]
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Applicants</h1>
            <p className="text-muted-foreground mt-2">
              {jobDetails?.title} • {jobDetails?.company}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applicants List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No applicants found
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {candidates.length === 0
                  ? "No one has applied to this job yet"
                  : "No applicants match your current filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => {
              const user = candidate.talentSeekerId.userId;
              const seeker = candidate.talentSeekerId;
              const StatusIcon = getStatusIcon(candidate.status);

              return (
                <Card
                  key={candidate._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {user.firstName} {user.lastName}
                            </h3>
                            <Badge
                              className={`w-fit ${getStatusColor(
                                candidate.status
                              )}`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {candidate.status.charAt(0).toUpperCase() +
                                candidate.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            {seeker.availability && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="capitalize">
                                  {seeker.availability}
                                </span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Applied {formatDate(candidate.appliedAt)}
                            </span>
                          </div>

                          {seeker.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {seeker.skills.slice(0, 5).map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {seeker.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{seeker.skills.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(candidate)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                              <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {quickActions.map((action) => {
                              const ActionIcon = action.icon;
                              return (
                                <DropdownMenuItem
                                  key={action.status}
                                  onClick={() =>
                                    handleUpdateStatus(
                                      candidate._id,
                                      action.status
                                    )
                                  }
                                  disabled={updatingStatus === candidate._id}
                                >
                                  {updatingStatus === candidate._id ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <ActionIcon className="h-4 w-4 mr-2" />
                                  )}
                                  {action.label}
                                </DropdownMenuItem>
                              );
                            })}
                            <Separator />
                            <DropdownMenuItem
                              onClick={() => handleDownloadResume(candidate)}
                            >
                              <DownloadCloud className="h-4 w-4 mr-2" />
                              Download Resume
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
