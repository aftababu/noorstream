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
import { Loader, Loader2, Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react"; // <--- ADDED useState HERE!
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
  import type { Session } from "next-auth";
import { useAuth } from "@/hooks/useAuth";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export function ProfileTab() {
  const {  session, updateSession, status } = useAuth();
  const user = session?.user;

  // Added state to track if the form has been initialized with user data
  const [isFormInitialized, setIsFormInitialized] = useState(false); // <--- Make sure useState is imported!

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
    },
    reValidateMode: 'onChange', // Or 'onBlur'
  });


  useEffect(() => {

    if (user && !isFormInitialized) {
      form.reset({
        name: user.name || "",

      });
      setIsFormInitialized(true);
    }
  }, [user, form, isFormInitialized]); 

  const handleImageUpload = useCallback(() => {
    toast.info("Image upload functionality is not yet fully implemented.");
    
  }, []);

  const handleUpdate = async (
    { name, image }: { name: string; image: string }
  ) => {
     await updateSession((prev: Session) => ({
      ...prev,
      user: {
        ...prev.user,
        name,
        image,
      },
    }));
    await updateSession();
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileFormSchema>) => {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      // await update({
      //   ...session,
      //   user: {
      //     ...session?.user,
      //     name: data.name,
      //     image: data.image, // Assuming your API returns the updated image URL
      //   },
      // });
     await handleUpdate( {
        name: data.name,
        image: data.image
      });
      toast.success("Profile updated successfully");
      form.reset(data); 
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    },
  });

  function onSubmit(data: z.infer<typeof profileFormSchema>) {
    updateProfileMutation.mutate(data);
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full min-h-[200px]">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-muted-foreground py-10">
        User data not available. Please ensure you are logged in.
      </div>
    );
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
            {/* Display the image from the form state if available, otherwise from user session */}
            {/* form.watch("image") ensures the avatar updates if image field was present and changed */}
            <AvatarImage src={ user?.image || ""} alt={user?.name || "User Avatar"} />
            <AvatarFallback className="text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
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
                  {/* {...field} handles the 'value' prop */}
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  shared collections.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" value={user?.email || ""} disabled />
                </FormControl>
                <FormDescription>
                  Your email address cannot be changed.
                </FormDescription>
                <FormMessage />
              </FormItem>

          {/* Removed the FormField for 'image' URL input as requested */}

          <Button
            type="submit"
            className="cursor-pointer"
            // Button is disabled if mutation is pending OR form is not dirty OR form is not valid
            disabled={updateProfileMutation.isPending || !form.formState.isDirty || !form.formState.isValid}
          >
            {updateProfileMutation.isPending ? (
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