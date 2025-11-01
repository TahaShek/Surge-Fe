// src/components/layout/RoleSwitcher.tsx
import { Briefcase, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useNavigate } from "react-router";
import { toast } from "sonner"; // or your toast library

export default function RoleSwitcher() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const handleSwitch = async (newRole: 'seeker' | 'finder') => {
    if (user?.currentRole === newRole) return;

    try {
      // Call API to switch role
      // const response = await axios.put('/api/users/switch-role', { role: newRole });
      
      // Update local state
      updateUser({ currentRole: newRole });
      
      toast.success(`Switched to ${newRole} mode`);
      
      // Navigate to appropriate dashboard
      navigate(newRole === 'seeker' ? '/seeker' : '/finder');
    } catch (error) {
      toast.error('Failed to switch role');
    }
  };

  return (
    <div className="flex w-full rounded-lg bg-muted p-1">
      <Button
        variant={user?.currentRole === 'seeker' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'flex-1 gap-2 text-xs',
          user?.currentRole === 'seeker' && 'bg-indigo-600 hover:bg-indigo-700 text-white'
        )}
        onClick={() => handleSwitch('seeker')}
      >
        <Search className="h-3.5 w-3.5" />
        <span>Find Jobs</span>
      </Button>
      <Button
        variant={user?.currentRole === 'finder' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'flex-1 gap-2 text-xs',
          user?.currentRole === 'finder' && 'bg-indigo-600 hover:bg-indigo-700 text-white'
        )}
        onClick={() => handleSwitch('finder')}
      >
        <Briefcase className="h-3.5 w-3.5" />
        <span>Post Jobs</span>
      </Button>
    </div>
  );
}