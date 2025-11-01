// components/dashboard/EnhancedDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Briefcase,
  Users,
  TrendingUp,
  Bookmark,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Building,
  Target,
  Star,
  BarChart3,
  Search,
  Filter,
  Download,
  Heart,
  Zap,
  Lightbulb,
  Brain,
  Shield,
  Code,
  Database,
  GitBranch,
  Server,
} from "lucide-react";
import { jobApi } from "@/features/jobs/api/job.api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IJob } from "@/features/jobs";

interface EnhancedDashboardStats {
  totalJobs: number;
  activeJobs: number;
  remoteJobs: number;
  featuredJobs: number;
  averageSalary: number;
  averageMatchScore: number;
  jobsByType: Array<{ type: string; count: number; color: string }>;
  jobsByExperience: Array<{ level: string; count: number; color: string }>;
  jobsByLocation: Array<{ location: string; count: number }>;
  matchScoreDistribution: Array<{
    range: string;
    count: number;
    color: string;
  }>;
  skillsDemand: Array<{ skill: string; count: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; jobs: number; applications: number }>;
  topCompanies: Array<{ company: string; jobs: number }>;
  salaryDistribution: Array<{ range: string; count: number }>;
  recentJobs: IJob[];
  recommendedJobs: Array<IJob & { matchScore?: number; matchDetails?: any }>;
  aiSummary: string;
  insights: {
    avgMatchScore: number;
    topSkills: string[];
  };
  profileSummary: {
    skills: string[];
    preferredJobTypes: string[];
    isOpenToRemote: boolean;
  };
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
];

// Enhanced JobCard Component
interface JobCardProps {
  job: IJob & { matchScore?: number; matchDetails?: any };
  showMatchScore?: boolean;
}

// Enhanced responsive JobCard component
function JobCard({ job, showMatchScore = false }: JobCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, icon: CheckCircle },
      draft: { variant: "secondary" as const, icon: Clock },
      closed: { variant: "outline" as const, icon: XCircle },
      pending: { variant: "secondary" as const, icon: Clock },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className="flex items-center gap-1 w-fit text-xs"
      >
        <Icon className="h-3 w-3" />
        <span className="hidden xs:inline">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className="xs:hidden">{status.charAt(0).toUpperCase()}</span>
      </Badge>
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200 text-green-700";
    if (score >= 60) return "bg-blue-50 border-blue-200 text-blue-700";
    if (score >= 40) return "bg-yellow-50 border-yellow-200 text-yellow-700";
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

  const displayMatchScore = job.matchScore || 0;

  return (
    <Card className="w-full hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg line-clamp-2 break-words">
                  {job.title}
                </h3>
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {job.company || "Unknown Company"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{job.location || "Remote"}</span>
                  </div>
                </div>
              </div>
              {showMatchScore && (
                <div
                  className={`px-3 py-1.5 rounded-full border ${getMatchColor(
                    displayMatchScore
                  )} flex-shrink-0`}
                >
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold">
                    <Target className="h-3 w-3" />
                    {displayMatchScore}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          {getStatusBadge(job.status)}
          <Badge variant="outline" className="text-xs">
            {job.jobType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {job.experienceLevel}
          </Badge>
          {job.jobWorkingType === "remote" && (
            <Badge variant="secondary" className="text-xs">
              Remote
            </Badge>
          )}
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">
              {job.salary.currency === "PKR" ? "Rs. " : "$"}
              {(job.salary.min / 1000).toFixed(0)}k -
              {(job.salary.max / 1000).toFixed(0)}k
            </span>
          </div>
        )}

        {/* Description */}
        {job.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs py-1">
                {getSkillIcon(skill)}
                <span className="hidden xs:inline ml-1">{skill}</span>
                <span className="xs:hidden ml-1">{skill.split(" ")[0]}</span>
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        <Separator className="my-4" />

        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{job.viewsCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{job.applicantsCount || 0}</span>
            </div>
            {job.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span className="sm:hidden">
                  {new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 self-stretch sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none text-xs"
            >
              <Bookmark className="h-3 w-3 sm:mr-2" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none text-xs">
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get icons for skills
function getSkillIcon(skill: string) {
  const skillIcons: { [key: string]: React.ReactNode } = {
    "Node.js": <Server className="h-3 w-3 mr-1" />,
    "Express.js": <Code className="h-3 w-3 mr-1" />,
    MongoDB: <Database className="h-3 w-3 mr-1" />,
    TypeScript: <Code className="h-3 w-3 mr-1" />,
    "REST APIs": <GitBranch className="h-3 w-3 mr-1" />,
    React: <Code className="h-3 w-3 mr-1" />,
    Python: <Code className="h-3 w-3 mr-1" />,
    Java: <Code className="h-3 w-3 mr-1" />,
    AWS: <Cloud className="h-3 w-3 mr-1" />,
    Docker: <Box className="h-3 w-3 mr-1" />,
  };

  return skillIcons[skill] || <Code className="h-3 w-3 mr-1" />;
}

// Cloud and Box icons (add these if not already imported)
function Cloud(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function Box(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

export default function EnhancedDashboard() {
  const [stats, setStats] = useState<EnhancedDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchEnhancedDashboardData();
  }, []);

  const fetchEnhancedDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch recommended jobs
      const recommendedResponse = await jobApi.getRecommendedJobs({
        limit: 50,
        page: 1,
      });

      console.log("🎯 Enhanced Recommendations Response:", recommendedResponse);

      const recommendedData = recommendedResponse.data || {};
      const recommendedJobs = recommendedData.jobs || [];

      // Fetch match scores for each recommended job
      const jobsWithMatchScores = await Promise.all(
        recommendedJobs.map(async (job) => {
          try {
            const matchResponse = await jobApi.getMatchScore(job._id);
            return {
              ...job,
              matchScore: matchResponse.data?.matchPercentage || 0,
              matchDetails: matchResponse.data?.matchDetails || {},
            };
          } catch (error) {
            console.error(
              `Failed to fetch match score for job ${job._id}:`,
              error
            );
            return { ...job, matchScore: 0, matchDetails: {} };
          }
        })
      );

      // Calculate enhanced statistics
      const enhancedStats: EnhancedDashboardStats = {
        totalJobs: jobsWithMatchScores.length,
        activeJobs: jobsWithMatchScores.filter((job) => job.status === "active")
          .length,
        remoteJobs: jobsWithMatchScores.filter(
          (job) => job.jobWorkingType === "remote"
        ).length,
        featuredJobs: jobsWithMatchScores.filter((job) => job.isFeatured)
          .length,
        averageSalary: calculateAverageSalary(jobsWithMatchScores),
        averageMatchScore: calculateAverageMatchScore(jobsWithMatchScores),
        jobsByType: calculateJobsByType(jobsWithMatchScores),
        jobsByExperience: calculateJobsByExperience(jobsWithMatchScores),
        jobsByLocation: calculateJobsByLocation(jobsWithMatchScores),
        matchScoreDistribution:
          calculateMatchScoreDistribution(jobsWithMatchScores),
        skillsDemand: calculateSkillsDemand(jobsWithMatchScores),
        monthlyTrend: generateMonthlyTrend(),
        topCompanies: calculateTopCompanies(jobsWithMatchScores),
        salaryDistribution: calculateSalaryDistribution(jobsWithMatchScores),
        recentJobs: jobsWithMatchScores.slice(0, 5),
        recommendedJobs: jobsWithMatchScores,
        aiSummary:
          recommendedData.aiSummary ||
          "Personalized insights based on your profile",
        insights: recommendedData.insights || {
          avgMatchScore: 0,
          topSkills: [],
        },
        profileSummary: recommendedData.profileSummary || {
          skills: [],
          preferredJobTypes: [],
          isOpenToRemote: false,
        },
      };

      setStats(enhancedStats);
    } catch (error) {
      console.error("Failed to fetch enhanced dashboard data:", error);
      // Set empty stats
      const emptyStats: EnhancedDashboardStats = {
        totalJobs: 0,
        activeJobs: 0,
        remoteJobs: 0,
        featuredJobs: 0,
        averageSalary: 0,
        averageMatchScore: 0,
        jobsByType: [],
        jobsByExperience: [],
        jobsByLocation: [],
        matchScoreDistribution: [],
        skillsDemand: [],
        monthlyTrend: [],
        topCompanies: [],
        salaryDistribution: [],
        recentJobs: [],
        recommendedJobs: [],
        aiSummary: "Complete your profile to get personalized insights",
        insights: { avgMatchScore: 0, topSkills: [] },
        profileSummary: {
          skills: [],
          preferredJobTypes: [],
          isOpenToRemote: false,
        },
      };
      setStats(emptyStats);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced calculation functions
  const calculateAverageMatchScore = (
    jobs: Array<IJob & { matchScore?: number }>
  ): number => {
    const jobsWithScores = jobs.filter(
      (job) => job.matchScore && job.matchScore > 0
    );
    if (jobsWithScores.length === 0) return 0;

    const total = jobsWithScores.reduce(
      (sum, job) => sum + (job.matchScore || 0),
      0
    );
    return Math.round(total / jobsWithScores.length);
  };

  const calculateMatchScoreDistribution = (
    jobs: Array<IJob & { matchScore?: number }>
  ) => {
    const ranges = [
      { range: "90-100%", min: 90, max: 100, color: "#00C49F" },
      { range: "80-89%", min: 80, max: 89, color: "#0088FE" },
      { range: "70-79%", min: 70, max: 79, color: "#FFBB28" },
      { range: "60-69%", min: 60, max: 69, color: "#FF8042" },
      { range: "0-59%", min: 0, max: 59, color: "#8884D8" },
    ];

    return ranges.map((range) => ({
      ...range,
      count: jobs.filter((job) => {
        const score = job.matchScore || 0;
        return score >= range.min && score <= range.max;
      }).length,
    }));
  };

  const calculateSkillsDemand = (jobs: IJob[]) => {
    const skillCount: Record<string, number> = {};

    jobs.forEach((job) => {
      job.skills?.forEach((skill) => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCount)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: Math.round((count / jobs.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Keep the existing calculation functions (calculateAverageSalary, calculateJobsByType, etc.)
  const calculateAverageSalary = (jobs: IJob[]): number => {
    const jobsWithSalary = jobs.filter((job) => job.salary && job.salary.min);
    if (jobsWithSalary.length === 0) return 0;

    const total = jobsWithSalary.reduce((sum, job) => {
      const min = job.salary?.min || 0;
      const max = job.salary?.max || min;
      return sum + (min + max) / 2;
    }, 0);

    return Math.round(total / jobsWithSalary.length);
  };

  const calculateJobsByType = (jobs: IJob[]) => {
    const typeCount: Record<string, number> = {};
    jobs.forEach((job) => {
      const type = job.jobType || "Other";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count], index) => ({
      type,
      count,
      color: COLORS[index % COLORS.length],
    }));
  };

  const calculateJobsByExperience = (jobs: IJob[]) => {
    const levelCount: Record<string, number> = {};
    jobs.forEach((job) => {
      const level = job.experienceLevel || "Not Specified";
      levelCount[level] = (levelCount[level] || 0) + 1;
    });

    return Object.entries(levelCount).map(([level, count], index) => ({
      level,
      count,
      color: COLORS[index % COLORS.length],
    }));
  };

  const calculateJobsByLocation = (jobs: IJob[]) => {
    const locationCount: Record<string, number> = {};
    jobs.forEach((job) => {
      const location = job.location || "Remote";
      locationCount[location] = (locationCount[location] || 0) + 1;
    });

    return Object.entries(locationCount)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const calculateTopCompanies = (jobs: IJob[]) => {
    const companyCount: Record<string, number> = {};
    jobs.forEach((job) => {
      const company = job.company || "Unknown";
      companyCount[company] = (companyCount[company] || 0) + 1;
    });

    return Object.entries(companyCount)
      .map(([company, jobs]) => ({ company, jobs }))
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 8);
  };

  const calculateSalaryDistribution = (jobs: IJob[]) => {
    const ranges = [
      { range: "0-50k", min: 0, max: 50000 },
      { range: "50k-100k", min: 50000, max: 100000 },
      { range: "100k-150k", min: 100000, max: 150000 },
      { range: "150k-200k", min: 150000, max: 200000 },
      { range: "200k+", min: 200000, max: Infinity },
    ];

    return ranges.map((range) => ({
      range: range.range,
      count: jobs.filter((job) => {
        const salary = job.salary?.min || 0;
        return salary >= range.min && salary < range.max;
      }).length,
    }));
  };

  const generateMonthlyTrend = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month) => ({
      month,
      jobs: Math.floor(Math.random() * 100) + 20,
      applications: Math.floor(Math.random() * 500) + 100,
    }));
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No data available</h3>
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={fetchEnhancedDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Career Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered insights and personalized job recommendations
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchEnhancedDashboardData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Match Analytics</TabsTrigger>
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">
              AI Recommendations
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Match Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Match Score Distribution</CardTitle>
                  <CardDescription>
                    How your profile matches with opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.matchScoreDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.matchScoreDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          {stats.matchScoreDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      No match data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Types Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Jobs by Type</CardTitle>
                  <CardDescription>Distribution of job types</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.jobsByType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.jobsByType}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, count }) => `${type}: ${count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {stats.jobsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Skills & Companies */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Skills in Demand</CardTitle>
                  <CardDescription>
                    Most requested skills in your matches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.skillsDemand.length > 0 ? (
                    <div className="space-y-4">
                      {stats.skillsDemand.map((skill, index) => (
                        <div
                          key={skill.skill}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {getSkillIcon(skill.skill)}
                            </div>
                            <span className="font-medium">{skill.skill}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {skill.count} jobs ({skill.percentage}%)
                            </span>
                            <div className="w-20 bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${skill.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No skills data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Match Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Experience Level Match */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience Level Distribution</CardTitle>
                  <CardDescription>
                    Jobs by required experience level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.jobsByExperience.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.jobsByExperience}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          {stats.jobsByExperience.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      No experience data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Salary Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Salary Distribution</CardTitle>
                  <CardDescription>Jobs by salary range</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.salaryDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.salaryDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      No salary data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Location & Monthly Trend */}
          </TabsContent>

          {/* Skills Analysis Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills Radar Analysis</CardTitle>
                <CardDescription>Your skills vs. market demand</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.skillsDemand.length > 0 &&
                stats.profileSummary.skills.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={prepareRadarData(stats)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Market Demand"
                        dataKey="demand"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Your Skills"
                        dataKey="yourLevel"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    Insufficient data for skills analysis
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Skill Profile</CardTitle>
                  <CardDescription>
                    Skills you've listed in your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.profileSummary.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {stats.profileSummary.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="text-sm"
                        >
                          {getSkillIcon(skill)}
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No skills listed in your profile
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Gap Analysis</CardTitle>
                  <CardDescription>
                    Opportunities for skill development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getSkillGapAnalysis(stats).length > 0 ? (
                    <div className="space-y-3">
                      {getSkillGapAnalysis(stats).map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <span className="font-medium">{skill.name}</span>
                          <Badge
                            variant={
                              skill.priority === "high"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {skill.priority} priority
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Your skills match well with market demands!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Recommendations Tab */}
          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="space-y-6">
              {/* AI Summary Card */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Brain className="h-5 w-5" />
                    AI Career Insights
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Personalized analysis based on your profile and market
                    trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Summary Text */}
                  <div className="flex flex-col sm:flex-row items-start gap-3 bg-muted/30 rounded-lg p-4">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm sm:text-base leading-relaxed">
                      {stats.aiSummary}
                    </p>
                  </div>

                  {/* Enhanced Insights Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-card rounded-lg border shadow-sm">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        {stats.averageMatchScore}%
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Avg Match Score
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-card rounded-lg border shadow-sm">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {stats.recommendedJobs.length}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Recommended Jobs
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-card rounded-lg border shadow-sm">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        {stats.insights.topSkills.length}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Top Skills
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-card rounded-lg border shadow-sm">
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">
                        {stats.remoteJobs}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Remote Jobs
                      </div>
                    </div>
                  </div>

                  {/* Profile Summary */}
                  <div className="bg-card rounded-lg border p-4 sm:p-6">
                    <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                      Your Profile Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-medium min-w-[60px]">
                            Skills:
                          </span>
                          {stats.profileSummary.skills.length > 0 ? (
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              {stats.profileSummary.skills
                                .slice(0, 3)
                                .join(", ")}
                              {stats.profileSummary.skills.length > 3 &&
                                ` +${
                                  stats.profileSummary.skills.length - 3
                                } more`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              Not specified
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-medium min-w-[60px]">
                            Job Types:
                          </span>
                          {stats.profileSummary.preferredJobTypes.length > 0 ? (
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              {stats.profileSummary.preferredJobTypes.join(
                                ", "
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              Any
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-medium min-w-[100px]">
                            Remote Work:
                          </span>
                          <Badge
                            variant={
                              stats.profileSummary.isOpenToRemote
                                ? "default"
                                : "outline"
                            }
                            className="w-fit text-xs"
                          >
                            {stats.profileSummary.isOpenToRemote ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-medium min-w-[100px]">
                            Opportunities:
                          </span>
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            {stats.totalJobs} matching jobs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Jobs Card */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                    Recommended Jobs For You
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {stats.recommendedJobs.length} job
                    {stats.recommendedJobs.length !== 1 ? "s" : ""} personalized
                    to your profile and skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recommendedJobs.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 lg:py-16">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-muted/50 p-4">
                          <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 max-w-sm">
                          <h3 className="text-lg sm:text-xl font-semibold">
                            No recommendations yet
                          </h3>
                          <p className="text-muted-foreground text-sm sm:text-base">
                            Complete your profile to get personalized job
                            recommendations
                          </p>
                        </div>
                        <Button size="sm" className="mt-2 px-6 py-2">
                          <User className="h-4 w-4 mr-2" />
                          Complete Profile
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Header Stats Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Sort by:</span>
                          <Badge variant="secondary" className="text-xs">
                            Best Match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span>
                            Avg. Match:{" "}
                            <strong>{stats.averageMatchScore}%</strong>
                          </span>
                          <span>
                            Showing:{" "}
                            <strong>{stats.recommendedJobs.length}</strong> jobs
                          </span>
                        </div>
                      </div>

                      {/* Jobs Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6">
                        {stats.recommendedJobs
                          .sort(
                            (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
                          )
                          .map((job, index) => (
                            <div
                              key={job._id}
                              className={`w-full transition-all duration-300 hover:scale-[1.02] ${
                                index < 2
                                  ? "ring-2 ring-blue-200 ring-opacity-50"
                                  : ""
                              }`}
                            >
                              <JobCard
                                job={job}
                                showMatchScore={true}
                                priority={index < 2} // Highlight top 2 matches
                              />
                            </div>
                          ))}
                      </div>

                      {/* Load More / Pagination */}
                      {stats.recommendedJobs.length > 6 && (
                        <div className="flex justify-center pt-4 border-t">
                          <Button variant="outline" className="px-8">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Load More Jobs
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper functions for data preparation
function prepareRadarData(stats: EnhancedDashboardStats) {
  const topSkills = stats.skillsDemand.slice(0, 8);
  const userSkills = stats.profileSummary.skills;

  return topSkills.map((skill) => ({
    skill: skill.skill,
    demand: skill.percentage,
    yourLevel: userSkills.includes(skill.skill) ? 80 : 20, // Simplified scoring
  }));
}

function getSkillGapAnalysis(stats: EnhancedDashboardStats) {
  const userSkills = stats.profileSummary.skills;
  const highDemandSkills = stats.skillsDemand
    .filter(
      (skill) => skill.percentage > 50 && !userSkills.includes(skill.skill)
    )
    .slice(0, 5);

  return highDemandSkills.map((skill) => ({
    name: skill.skill,
    priority: skill.percentage > 70 ? "high" : "medium",
    demand: skill.percentage,
  }));
}

// Keep your existing StatCard and DashboardSkeleton components, but update StatCard to use the new interface

// Add RefreshCw icon if not already present
function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

// DashboardSkeleton component (keep your existing one)
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
