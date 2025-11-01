import { 
  Home,
  Search,
  FileText,
  Bookmark,
  MessageSquare,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  BarChart3
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRoleStore } from "@/features/auth/store/role.store";

// Talent Seeker Navigation (Job Seeker)
const seekerNavigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Your job search dashboard"
  },
  {
    title: "Browse Jobs",
    href: "/jobs",
    icon: Search,
    description: "Find new opportunities"
  },
  {
    title: "My Applications",
    href: "/my-applications",
    icon: FileText,
    description: "Track your job applications"
  },
  {
    title: "Saved Jobs",
    href: "/bookmarks",
    icon: Bookmark,
    description: "Your favorite job listings"
  },
  {
    title: "Messages",
    href: "/chat",
    icon: MessageSquare,
    description: "Chat with employers"
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Your professional profile"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and preferences"
  },
];

// Talent Finder Navigation (Recruiter/Employer)
const finderNavigationItems = [
  {
    title: "Dashboard",
    href: "/finder",
    icon: Home,
    description: "Overview of your job posts and applications"
  },
  {
    title: "My Job Posts",
    href: "/my-jobs",
    icon: Briefcase,
    description: "View and manage all your posted opportunities"
  },
  {
    title: "Create Job",
    href: "/create-job",
    icon: PlusCircle,
    description: "Post a new opportunity"
  },
  {
    title: "Applicants",
    href: "/applicants",
    icon: Users,
    description: "View all applicants across jobs"
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "View insights and performance metrics"
  },
  {
    title: "Messages",
    href: "/chat",
    icon: MessageSquare,
    description: "Chat with applicants"
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Your organization profile"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and preferences"
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const { currentRole } = useRoleStore();

  // Get navigation items based on current role
  const getNavigationItems = () => {
    switch (currentRole) {
      case "talent_finder":
        return finderNavigationItems;
      case "talent_seeker":
      default:
        return seekerNavigationItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Get role display name for the header
  const getRoleDisplayName = () => {
    switch (currentRole) {
      case "talent_finder":
        return "Recruiter";
      case "talent_seeker":
        return "Job Seeker";
      default:
        return "User";
    }
  };

  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      {/* Logo/Brand */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <div className="flex flex-col">
            <span>CampusConnect</span>
            <span className="text-xs text-muted-foreground">
              {getRoleDisplayName()} Mode
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2 lg:px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground group",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
                title={item.description}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground hidden group-hover:block">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto p-4">
        <div className="mb-4 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium">{getRoleDisplayName()} Mode</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Switch roles from the navbar
          </p>
        </div>
        
        <Separator className="mb-4" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}