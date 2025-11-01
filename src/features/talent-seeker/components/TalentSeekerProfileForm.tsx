import React from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import TextInput from "@/components/form/TextInput";
import { Button } from "@/components/ui/button";

type EducationItem = {
  degree: string;
  institution: string;
  year?: number | null;
};

type FormData = {
  title?: string;
  bio?: string;
  skills?: string; // comma-separated on UI, converted to string[] on submit
  experience?: number;
  education: EducationItem[];
  portfolio?: string;
  github?: string;
  linkedin?: string;
  resume?: string;
  availability?: "available" | "not-available" | "open-to-offers";
  expectedSalary?: { min?: number; max?: number; currency?: string };
  location?: string;
  isOpenToRemote?: boolean;
  preferredJobTypes?: string[]; // sent as array
};

const jobTypeOptions = ["full-time", "part-time", "contract", "freelance"];

const TalentSeekerProfileForm: React.FC = () => {
  const methods = useForm<FormData>({
    defaultValues: {
      title: "",
      bio: "",
      skills: "",
      experience: undefined,
      education: [{ degree: "", institution: "", year: undefined }],
      portfolio: "",
      github: "",
      linkedin: "",
      resume: "",
      availability: "available",
      expectedSalary: { min: undefined, max: undefined, currency: "USD" },
      location: "",
      isOpenToRemote: false,
      preferredJobTypes: [],
    },
  });

  const { register, control, handleSubmit, formState } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  async function onSubmit(values: FormData) {
    try {
      // transform skills string into array and coerce numeric fields
      const skillsArray = (values.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
      const experienceNumber = values.experience ? Number(values.experience) : undefined;
      const educationNormalized = (values.education || []).map((e) => ({
        degree: e.degree,
        institution: e.institution,
        year: e.year ? Number(e.year) : undefined,
      }));
      const expectedSalary = {
        min: values.expectedSalary?.min ? Number(values.expectedSalary.min) : undefined,
        max: values.expectedSalary?.max ? Number(values.expectedSalary.max) : undefined,
        currency: values.expectedSalary?.currency || "USD",
      };

      const payload = {
        title: values.title,
        bio: values.bio,
        skills: skillsArray,
        experience: experienceNumber,
        education: educationNormalized,
        portfolio: values.portfolio,
        github: values.github,
        linkedin: values.linkedin,
        resume: values.resume,
        availability: values.availability,
        expectedSalary,
        location: values.location,
        isOpenToRemote: values.isOpenToRemote,
        preferredJobTypes: values.preferredJobTypes,
      };

      // Call backend API - adjust endpoint as appropriate in your app
      const res = await fetch("/api/talent-seeker", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Failed to save talent seeker profile:", err);
        return;
      }

      const data = await res.json();
      console.log("Saved talent seeker profile:", data);
      // reset form to returned state if useful
      // reset(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
  <FormProvider {...methods}>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TextInput 
          name="title" 
          label="Professional Title" 
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full"
        />
      </div>

      {/* Bio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Bio
          <span className="text-gray-500 text-sm font-normal ml-1">(Brief introduction)</span>
        </label>
        <textarea 
          {...register("bio")} 
          placeholder="Tell us about your professional background, passions, and what you're looking for..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none min-h-[100px]"
        />
      </div>

      {/* Skills & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TextInput 
            name="skills" 
            label="Skills" 
            placeholder="Comma separated, e.g. React, Node.js, GraphQL"
            className="w-full"
          />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TextInput 
            name="experience" 
            label="Experience" 
            type="number" 
            placeholder="0"
            className="w-full"
            suffix="years"
          />
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
            <p className="text-sm text-gray-600 mt-1">Add your educational background</p>
          </div>
          <Button 
            type="button" 
            onClick={() => append({ degree: "", institution: "", year: undefined })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add Education
          </Button>
        </div>
        
        <div className="space-y-4 mt-4">
          {fields.map((f, idx) => (
            <div key={f.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <TextInput 
                  name={`education.${idx}.degree`} 
                  label="Degree" 
                  placeholder="e.g. Bachelor of Science"
                  className="w-full"
                />
                <TextInput 
                  name={`education.${idx}.institution`} 
                  label="Institution" 
                  placeholder="University name"
                  className="w-full"
                />
                <TextInput 
                  name={`education.${idx}.year`} 
                  label="Graduation Year" 
                  type="number" 
                  placeholder="2020"
                  className="w-full"
                />
              </div>
              <div className="mt-3 flex justify-end">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => remove(idx)}
                  className="bg-red-500 text-white hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Online Presence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput 
            name="portfolio" 
            label="Portfolio URL" 
            type="url" 
            placeholder="https://yourportfolio.com"
            className="w-full"
            icon="🌐"
          />
          <TextInput 
            name="github" 
            label="GitHub" 
            placeholder="yourusername"
            className="w-full"
            icon="💻"
          />
          <TextInput 
            name="linkedin" 
            label="LinkedIn" 
            placeholder="linkedin.com/in/yourprofile"
            className="w-full"
            icon="💼"
          />
          <TextInput 
            name="resume" 
            label="Resume URL" 
            type="url" 
            placeholder="https://drive.google.com/your-resume"
            className="w-full"
            icon="📄"
          />
        </div>
      </div>

      {/* Availability & Remote Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Availability
          </label>
          <select 
            {...register("availability")} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="available">Available</option>
            <option value="open-to-offers">Open to offers</option>
            <option value="not-available">Not available</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <input 
              type="checkbox" 
              {...register("isOpenToRemote")} 
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <label className="text-sm font-semibold text-gray-900">Open to remote work</label>
              <p className="text-xs text-gray-600 mt-1">Work from anywhere in the world</p>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Expectations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Expectations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput 
            name="expectedSalary.min" 
            label="Minimum Salary" 
            type="number" 
            placeholder="50000"
            className="w-full"
          />
          <TextInput 
            name="expectedSalary.max" 
            label="Maximum Salary" 
            type="number" 
            placeholder="80000"
            className="w-full"
          />
          <TextInput 
            name="expectedSalary.currency" 
            label="Currency" 
            placeholder="USD"
            className="w-full"
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TextInput 
          name="location" 
          label="Location" 
          placeholder="City, Country"
          className="w-full"
          icon="📍"
        />
      </div>

      {/* Job Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Preferred Job Types
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {jobTypeOptions.map((opt) => (
            <label key={opt} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <input 
                type="checkbox" 
                value={opt} 
                {...register("preferredJobTypes")} 
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Button 
          type="submit" 
          disabled={formState.isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {formState.isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Profile...
            </span>
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
