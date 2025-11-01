
import { useRoleStore } from "@/features/auth/store/role.store";
import { TalentFinderProfileForm } from "@/features/talent-finder/components/TalentFinderProfileForm";
import TalentSeekerProfileForm from "@/features/talent-seeker/components/TalentSeekerProfileForm";

export function ProfileSwitchPage() {
  const { currentRole } = useRoleStore();
  
  // Check user role and render appropriate form
  if (currentRole === "talent_finder") {
    return <TalentFinderProfileForm />;
  }
  
  return <TalentSeekerProfileForm />;
}