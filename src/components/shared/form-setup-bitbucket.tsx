"use client";

import LogoBitbucket from "@/assets/img/logo-bitbucket";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { TypographyH1 } from "@/components/typography/typography-h1";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validationToast } from "@/utils/form-validation";
import { NOTION_BITBUCKET_CREATE_PASSWORD_URL } from "@/utils/constants";
import Link from "next/link";
import Description from "@/components/ui/description";
import { ChevronRight } from "lucide-react";
import ButtonLoading from "../ui/button-loading";
import { useGlobalStore } from "@/stores/global";

const formSchema = z.object({
  bbUsername: z.string().min(3, "Bitbucket Username is required"),
  bbPassword: z.string().min(6, "Bitbucket Password is required"),
});

export default function FormSetupBitbucket() {
  const { user, getUser } = useGlobalStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      bbUsername: "",
      bbPassword: "",
    },
  });

  const mutationCreateUser = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("users")
        .upsert({ id: user?.id, ...data });
      if (error) throw error;
    },
    onSuccess: async () => {
      await getUser();
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: any) => {
    mutationCreateUser.mutate(data);
  };

  return (
    <div className="fixed w-full h-full flex items-center justify-center bg-background/50 z-10 left-0 top-0">
      <div className="w-full max-w-[650px] bg-background shadow-sm px-8 text-left flex flex-col justify-center">
        <TypographyH1 className="text-center pb-4">
          Complete your account
        </TypographyH1>
        <div className="flex flex-col gap-[15px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, validationToast.recent)}
            >
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="bbUsername"
                  render={({ field }) => (
                    <Input placeholder="Bitbucket username" {...field} />
                  )}
                />
                <FormField
                  control={form.control}
                  name="bbPassword"
                  render={({ field }) => (
                    <Input placeholder="Bitbucket app password" {...field} />
                  )}
                />
                <Description>
                  Need help or haven't obtained your credentials yet?{" "}
                  <Link
                    target="_blank"
                    href={NOTION_BITBUCKET_CREATE_PASSWORD_URL}
                    className="underline underline-offset-2"
                  >
                    click here
                  </Link>
                </Description>
              </div>
              <ButtonLoading
                icon={ChevronRight}
                loading={mutationCreateUser.isPending}
                type="submit"
                className="mt-10 w-full py-6"
              >
                Create account
              </ButtonLoading>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
