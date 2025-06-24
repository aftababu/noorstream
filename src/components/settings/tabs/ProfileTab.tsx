"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  image: z.string().url().optional().nullable(),
});

export function ProfileTab() {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      image: session?.user?.image || "",
    },
  });

  // Function to handle image upload (simplified for this implementation)
  const handleImageUpload = useCallback(() => {
    // Implement file upload logic here
    toast.success("Profile picture updated successfully");
  }, []);

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsSubmitting(true);
      
      // API call to update user profile would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          image: values.image,
        },
      });

      // toast({
      //   title: "Profile updated",
      //   description: "Your profile has been updated successfully.",
      // });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">
          Update your personal information and profile picture.
        </p>
      </div>

      <div className="flex items-center justify-center sm:justify-start py-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="text-lg">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2"
            onClick={handleImageUpload}
          >
            <Pencil className="h-3 w-3" />
            <span className="sr-only">Change profile picture</span>
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in shared collections.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} disabled />
                </FormControl>
                <FormDescription>
                  Your email address cannot be changed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update profile"
            )}
          </Button>
        </form>
      </Form>

      <Separator className="my-8" />

      <div>
        <h3 className="text-lg font-medium mb-4">Password</h3>
        <Button variant="outline">Change password</Button>
      </div>
    </div>
  );
}