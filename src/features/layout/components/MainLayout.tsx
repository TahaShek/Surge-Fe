import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  className?: string;
}

export function MainLayout({ className }: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar className="border-r" />
      </div>

      {/* Main content area */}
      <div className="lg:pl-72">
        {/* Navbar - Always visible */}
        <Navbar />

        {/* Main content with max width and padding */}
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Content wrapper with card-like appearance */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-auto py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}