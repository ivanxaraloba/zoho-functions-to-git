"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { files, obj } from "@/utils/generic";
import { supabase } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Settings } from "lucide-react";
import { useGlobalStore } from "@/stores/global";
import { useProjectStore } from "@/stores/project";
import ButtonLoading from "../ui/button-loading";
import { Project } from "@/types/types";

const formSchema = z
  .object({
    owner: z.string().min(1),
    cookie: z.string().optional(),
    userAgent: z.string().optional(),
    file: z.instanceof(File).optional(),
  })
  .refine((data) => (data.cookie && data.userAgent) || data.file, {
    message:
      "You must provide either a Cookie and User Agent or upload a .har file.",
    path: ["file"], // You can target both fields or just the file for error display
  });

export default function DialogSettingsCreator() {
  const { project, getProject } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner: "",
      cookie: "",
      userAgent: "",
      file: undefined,
    },
  });

  const mutationUpdateSettings = useMutation({
    mutationFn: async ({
      owner,
      cookie,
      userAgent,
    }: {
      owner: string;
      cookie?: string;
      userAgent?: string;
      file?: File;
    }) => {
      const { error } = await supabase.from("creator").upsert({
        id: project?.creator?.id,
        projectId: project?.id,
        owner,
        config: { cookie, "user-agent": userAgent },
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      // @ts-ignore
      getProject(project?.username);
      toast.success("Settings updated successfully!");
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Error loading file");
    },
  });

  const onSubmit = (data: any) => {
    mutationUpdateSettings.mutate(data);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const content = await files.read(file);
        const json = JSON.parse(content);

        const cookie = obj.findToken(json, "Cookie", "ZCBUILDERFIVE=true;");
        const userAgent = obj.findToken(json, "user-agent");

        if (!cookie || !userAgent)
          throw new Error("Cookie or UserAgent is missing");

        form.setValue("cookie", cookie);
        form.setValue("userAgent", userAgent);
        toast.success("File read successfuly");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error reading file");
    }
  };

  useEffect(() => {
    form.reset({
      ...project?.creator,
      cookie: project?.creator?.config?.cookie,
      userAgent: project?.creator?.config?.["user-agent"],
    });
  }, [project?.id]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center"
            >
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Owner Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr className="bg-border my-8 h-0.5 w-full" />
              <div className="flex flex-col gap-4 w-full">
                <FormField
                  control={form.control}
                  name="cookie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cookie</FormLabel>
                      <FormControl>
                        <Input placeholder="Cookie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userAgent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Agent</FormLabel>
                      <FormControl>
                        <Input placeholder="User Agent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <span className="text-sm mt-5">or</span>
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File .Har</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".har"
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Retrieve the file from the Form Workflows list page
                    </FormDescription>
                  </FormItem>
                )}
              />
              <ButtonLoading
                className="w-full mt-4"
                type="submit"
                loading={mutationUpdateSettings.isPending}
              >
                Save Changes
              </ButtonLoading>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
