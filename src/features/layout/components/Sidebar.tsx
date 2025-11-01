import { 
  Home,
  Search,
  FileText,
  Bookmark,
  MessageSquare,
  User,
  Settings,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/store/auth.store";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/seeker",
    icon: Home,
  },
  {
    title: "Browse Jobs",
    href: "/jobs",
    icon: Search,
  },
  {
    title: "My Applications",
    href: "/my-applications",
    icon: FileText,
  },
  {
    title: "Saved Jobs",
    href: "/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Messages",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      {/* Logo/Brand */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>CampusConnect</span>
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
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto p-4">
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