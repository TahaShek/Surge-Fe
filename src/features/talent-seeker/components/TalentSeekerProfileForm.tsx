import React from "react";
import { useForm, useFieldArray, FormProvider, Controller } from "react-hook-form";
import TextInput from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { TalentSeekerFormData } from "@/features/talent-seeker/types";
import { useTalentSeekerStore } from "@/features/talent-seeker/store";
import { Plus, Trash2, Loader2, FileUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

interface TalentSeekerProfileFormProps {
  existingProfile?: TalentSeekerFormData | null;
}

const TalentSeekerProfileForm: React.FC<TalentSeekerProfileFormProps> = ({
  existingProfile,
}) => {
  const { getProfile, profile: storeProfile } = useTalentSeekerStore();
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      if (isInitialLoad) {
        await getProfile();
        setIsInitialLoad(false);
      }
    };
    loadProfile();
  }, [getProfile, isInitialLoad]);

  const methods = useForm<TalentSeekerFormData>({
    defaultValues: {
      title: storeProfile?.title ?? existingProfile?.title ?? "",
      bio: storeProfile?.bio ?? existingProfile?.bio ?? "",
      skills: Array.isArray(storeProfile?.skills)
        ? storeProfile.skills.join(", ")
        : storeProfile?.skills ?? "",
      experience:
        storeProfile?.experience ?? existingProfile?.experience ?? undefined,
      education:
        storeProfile?.education ??
        existingProfile?.education ?? [
          { degree: "", institution: "", year: undefined },
        ],
      portfolio: storeProfile?.portfolio ?? existingProfile?.portfolio ?? "",
      github: storeProfile?.github ?? existingProfile?.github ?? "",
      linkedin: storeProfile?.linkedin ?? existingProfile?.linkedin ?? "",
      resume: undefined,
      availability:
        storeProfile?.availability ??
        existingProfile?.availability ??
        "available",
      expectedSalary: {
        min:
          storeProfile?.expectedSalary?.min ??
          existingProfile?.expectedSalary?.min ??
          undefined,
        max:
          storeProfile?.expectedSalary?.max ??
          existingProfile?.expectedSalary?.max ??
          undefined,
        currency:
          storeProfile?.expectedSalary?.currency ??
          existingProfile?.expectedSalary?.currency ??
          "USD",
      },
      location: storeProfile?.location ?? existingProfile?.location ?? "",
      isOpenToRemote:
        storeProfile?.isOpenToRemote ??
        existingProfile?.isOpenToRemote ??
        false,
      preferredJobTypes:
        storeProfile?.preferredJobTypes ??
        existingProfile?.preferredJobTypes ??
        [],
    },
  });

  const { register, control, handleSubmit, formState, reset } = methods;

  React.useEffect(() => {
    if (storeProfile) {
      reset(storeProfile);
    }
  }, [storeProfile, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  // ✅ Updated onSubmit — properly sends resume as multipart file
  async function onSubmit(values: TalentSeekerFormData) {
    const formData = new FormData();

    for (const key in values) {
      const value = (values as any)[key];

      if (value === undefined || value === null) continue;

      if (key === "education" || key === "expectedSalary" || key === "preferredJobTypes") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "resume") {
        // ✅ Handle resume as real file
        if (value instanceof FileList && value.length > 0) {
          formData.append("resume", value[0]); // attach actual file
        } else if (typeof value === "string" && value) {
          // already uploaded URL
          formData.append("resumeUrl", value);
        }
      } else {
        formData.append(key, value as any);
      }
    }

    const { upsertProfile } = useTalentSeekerStore.getState();

    try {
      const response = await upsertProfile(formData);
      console.log("✅ Profile saved successfully:", response);
    } catch (err) {
      console.error("❌ Error saving profile:", err);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter your title and short bio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TextInput
              name="title"
              label="Professional Title"
              placeholder="e.g. Senior Frontend Engineer"
            />
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
                Bio
              </label>
              <Textarea 
                placeholder="Describe your company (minimum 50 characters)"
                className="min-h-[100px]"
                {...register("bio")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills & Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Experience</CardTitle>
            <CardDescription>
              List your technical skills and years of experience
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              name="skills"
              label="Skills"
              placeholder="React, Node.js, AWS..."
            />
            <TextInput
              name="experience"
              label="Experience (Years)"
              type="number"
              placeholder="5"
            />
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>
                Add your educational background
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={() =>
                append({ degree: "", institution: "", year: undefined })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((f, idx) => (
              <div
                key={f.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border border-gray-200 p-4 rounded-xl"
              >
                <TextInput name={`education.${idx}.degree`} label="Degree" />
                <TextInput
                  name={`education.${idx}.institution`}
                  label="Institution"
                />
                <TextInput
                  name={`education.${idx}.year`}
                  label="Year"
                  type="number"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(idx)}
                  className="md:col-span-3 justify-self-end"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
            <CardDescription>Share your online profiles</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput name="portfolio" label="Portfolio URL" />
            <TextInput name="github" label="GitHub" />
            <TextInput name="linkedin" label="LinkedIn" />

            {/* ✅ Resume File Upload */}

          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Specify your job preferences and availability
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              name="location"
              label="Preferred Location"
              placeholder="Remote / On-site"
            />
            <div>
  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">
    Availability
  </label>
  <Controller
    name="availability"
    control={control}
    render={({ field }) => (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="w-full border border-gray-200 rounded-lg px-4 py-3 dark:text-gray-100 dark:border-gray-600 
                                    hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200">
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="open-to-offers">Open to Offers</SelectItem>
          <SelectItem value="not-available">Not Available</SelectItem>
        </SelectContent>
      </Select>
    )}
  />
</div>

          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full"
          >
            {formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TalentSeekerProfileForm;
