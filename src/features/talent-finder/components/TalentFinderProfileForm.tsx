import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { talentFinderFormSchema, companySizeOptions, type TalentFinderFormValues } from "../schemas/talentFinderFormSchema";
import { useTalentFinderStore } from "../store/talentFinder.store";
import { useEffect } from "react";

export function TalentFinderProfileForm() {
  const { toast } = useToast();
  const { profile, upsertProfile, getMyProfile } = useTalentFinderStore();

  const form = useForm({
    resolver: zodResolver(talentFinderFormSchema),
    defaultValues: {
      company: profile?.company ?? "",
      companySize: profile?.companySize ?? undefined,
      industry: profile?.industry ?? "",
      website: profile?.website ?? "",
      description: profile?.description ?? "",
      location: profile?.location ?? "",
      isVerifiedCompany: profile?.isVerifiedCompany ?? false,
    },
  });

  useEffect(() => {
    (async () => {
      await getMyProfile();
    })();
  }, [getMyProfile]);

  // ✅ Update form values when profile is fetched
  useEffect(() => {
    if (profile) {
      form.reset({
        company: profile.company ?? "",
        companySize: profile.companySize ?? undefined,
        industry: profile.industry ?? "",
        website: profile.website ?? "",
        description: profile.description ?? "",
        location: profile.location ?? "",
        isVerifiedCompany: profile.isVerifiedCompany ?? false,
      });
    }
  }, [profile, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await upsertProfile(data);
      if (response?.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizeOptions.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your industry" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company website URL" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company location" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your company (minimum 50 characters)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}