// components/modals/initial-modal.tsx
"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

// We need more fields than Discord for OrionOS setup
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Profile name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Profile image is required.",
  }),
  wallpaper: z.string().optional(), // Optional custom wallpaper
  constellation: z
    .string()
    .min(1, {
      message: "Workspace name is required.",
    })
    .default("Default Workspace"),
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      constellation: "Default Workspace",
      wallpaper: "/wallpapers/default-black.jpg",
    },
  });

  const isLoading = form.formState.isSubmitting || isInitializing;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsInitializing(true);

      // Initialize the entire OS with custom values
      const response = await axios.post("/api/system/initialize", values);

      // Log the initialization data
      console.log("OrionOS Initialization:", response.data);

      form.reset();
      router.refresh();

      // Redirect to the desktop
      router.push(`/desktop/${response.data.profileId}`);
    } catch (error) {
      console.error("Initialization failed:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="bg-[#010203] bg-opacity-69 border-s border-white border-opacity-10 text-[#ABC4C3] p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Welcome to OrionOS
          </DialogTitle>
          <DialogDescription className="text-center text-[#748393]">
            Let's personalize your workspace. You can customize everything later
            in Flow.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="profileImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-[#748393]">
                      Profile Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-black bg-opacity-30 border-[#292929] border-opacity-81 focus-visible:ring-0 text-[#ABC4C3] focus-visible:ring-offset-0"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constellation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-[#748393]">
                      Workspace Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-black bg-opacity-30 border-[#292929] border-opacity-81 focus-visible:ring-0 text-[#ABC4C3] focus-visible:ring-offset-0"
                        placeholder="Name your workspace"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-black bg-opacity-84 px-6 py-4">
              <Button
                variant="default"
                disabled={isLoading}
                className="bg-[#7B6CBD] hover:bg-[#7B6CBD]/90"
              >
                {isInitializing ? "Initializing..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
