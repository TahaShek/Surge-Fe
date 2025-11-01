import { Users, Settings, LayoutDashboard, LogOut, ClipboardEdit, MessageSquare, Bell, Map } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAbility } from "@/features/authorization";
import type { Subjects } from "@/features/authorization/types/ability.types";
import { useAuthStore } from "@/features/auth/store/auth.store";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    subject: 'Dashboard' as Subjects,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
    subject: 'Chat' as Subjects,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    subject: 'Notifications' as Subjects,
  },
  {
    title: "Maps",
    href: "/maps",
    icon: Map,
    subject: 'Maps' as Subjects,
  },
  {
    title: "Hello",
    href: "/users",
    icon: Users,
    subject: 'Hello' as Subjects,  // Updated to match the new subject name
  },
  {
    title: "User Form",
    href: "/user-form",
    icon: ClipboardEdit,
    subject: 'UserForm' as Subjects,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    subject: 'Settings' as Subjects,
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const location = useLocation();
  const ability = useAbility();
  const logout = useAuthStore((state) => state.logout);

  // Filter navigation items based on permissions
  const authorizedItems = navigationItems.filter(item => 
    ability.can('read', item.subject)
  );

  return (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      {/* Logo/Brand */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>My App</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2 lg:px-4">
          {authorizedItems.map((item) => {
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