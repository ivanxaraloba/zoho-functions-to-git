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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { files, obj, str } from "@/utils/generic";
import { supabase } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useGlobalStore } from "@/stores/global";
import { Combobox } from "../ui/combobox";
import ButtonLoading from "../ui/button-loading";

const formSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  domain: z.string().min(1),
  departmentId: z.number(),
});

export default function DialogCreateProject() {
  const { getProjects, departments } = useGlobalStore();

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      domain: "",
      departmentId: undefined,
    },
  });

  const mutationCreateProject = useMutation({
    mutationFn: async (data: { name: string; file: File }) => {
      const { error } = await supabase.from("projects").insert(data);
      if (error) throw error;
    },
    onSuccess: async () => {
      getProjects();
      toast.success("Project created successfully!");
      setIsOpen(false);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message || "Error loading file");
    },
  });

  const onSubmit = (data: any) => {
    mutationCreateProject.mutate(data);
  };

  useEffect(() => {
    const name = form.watch("name");
    if (!name) return;
    form.setValue("username", str.slugify(name), { shouldValidate: true });
  }, [form.watch("name")]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="text-start" onClick={() => setIsOpen(true)}>
            <PlusIcon className="mr-2" />
            <span>New project</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-4 flex-col items-center justify-center"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Combobox
                        variant="outline"
                        items={["eu", "com"].map((i) => ({
                          label: i,
                          value: i,
                        }))}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Combobox
                        variant="outline"
                        items={departments.map((i) => ({
                          label: i.name,
                          value: i.id,
                        }))}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ButtonLoading
                className="w-full"
                type="submit"
                loading={mutationCreateProject.isPending}
              >
                Create
              </ButtonLoading>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
