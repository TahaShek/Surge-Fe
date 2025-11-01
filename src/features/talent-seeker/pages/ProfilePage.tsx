import React, { useEffect } from "react";
import { TalentSeekerProfileForm } from "@/features/talent-seeker/components";
import { useTalentSeekerStore } from "../store";
import { LoadingSkeleton } from "@/components/ui/loading/LoadingSkeleton";

const ProfilePage: React.FC = () => {
  const { getProfile, profile, isLoading, error } = useTalentSeekerStore();

  useEffect(() => {
    // Load profile on mount
    getProfile();
  }, [getProfile]);

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Loading profile...</h1>
        <LoadingSkeleton className="w-full h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Error loading profile</h1>
        <div className="text-red-500">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {profile ? 'Edit your Talent Seeker profile' : 'Complete your Talent Seeker profile'}
      </h1>
      <TalentSeekerProfileForm
        existingProfile={profile ? {
          ...profile,
          experience: profile.experience ?? undefined,
          education: profile.education ?? [{ degree: "", institution: "", year: undefined }],
          preferredJobTypes: profile.preferredJobTypes ?? [],
          expectedSalary: {
            min: profile.expectedSalary?.min ?? undefined,
            max: profile.expectedSalary?.max ?? undefined,
            currency: profile.expectedSalary?.currency ?? "USD"
          }
        } : undefined}
      />

    </div>
  );
};


export default ProfilePage;