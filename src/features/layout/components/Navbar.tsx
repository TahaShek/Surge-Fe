import {
  Menu,
  Search,
  LogOut,
  User,
  Settings,
  Briefcase,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "@/features/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationBell } from "@/features/notifications";
import { useRoleStore } from "@/features/auth/store/role.store";

export function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { currentRole, availableRoles, setCurrentRole } = useRoleStore();

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0] || ""}${
      user.lastName?.[0] || ""
    }`.toUpperCase();
  };

  const handleRoleChange = (roleName: string) => {
    setCurrentRole(roleName);

    // Navigate to appropriate dashboard based on role
    if (roleName === "talent_finder") {
      navigate("/my-jobs");
    } else if (roleName === "talent_seeker") {
      navigate("/dashboard");
    }

    // Force a small delay to ensure the sidebar re-renders with new navigation
    setTimeout(() => {
      window.dispatchEvent(new Event("roleChanged"));
    }, 100);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getRoleDisplayName = (roleName: string) => {
    const roleMap: Record<string, string> = {
      talent_finder: "Recruiter",
      talent_seeker: "Job Seeker",
    };
    return (
      roleMap[roleName] ||
      roleName.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const getRoleIcon = (roleName: string) => {
    if (roleName === "talent_finder") {
      return <Briefcase className="h-4 w-4" />;
    } else if (roleName === "talent_seeker") {
      return <Users className="h-4 w-4" />;
    }
    return <User className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Search Bar */}
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        {availableRoles.length > 1 && (
          <div className="flex items-center gap-2">
            <Select value={currentRole || ""} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Select role">
                  {currentRole && (
                    <div className="flex items-center gap-2">
                      {getRoleIcon(currentRole)}
                      <span className="text-xs font-medium">
                        {getRoleDisplayName(currentRole)}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role._id} value={role.name}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role.name)}
                      <span>{getRoleDisplayName(role.name)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.firstName || "User"}
                />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
                {currentRole && (
                  <div className="flex items-center gap-1 mt-1">
                    {getRoleIcon(currentRole)}
                    <span className="text-xs text-muted-foreground">
                      {getRoleDisplayName(currentRole)}
                    </span>
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
