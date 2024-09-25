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
import VideoPlayerSettings from "./video-player-settings";

const formSchema = z.object({
  owner: z.string().min(1),
  file: z.instanceof(File),
});

export default function DialogSettingsCreator() {
  const { project, getProject } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner: "",
      file: undefined,
    },
  });

  const mutationUpdateSettings = useMutation({
    mutationFn: async ({ owner, file }: { owner: string; file?: File }) => {
      const content = await files.read(file);
      const json = JSON.parse(content);

      let config = {
        cookie: obj.findToken(json, "Cookie", "ZCBUILDERFIVE=true;"),
        "user-agent": obj.findToken(json, "user-agent"),
      };

      const { error } = await supabase.from("creator").upsert({
        id: project?.creator?.id,
        projectId: project?.id,
        owner,
        config,
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

  useEffect(() => {
    form.reset({
      ...project?.creator,
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
            <VideoPlayerSettings src="/videos/settings_creator.mp4" />
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center gap-4"
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
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
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
