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

const formSchema = z.object({
  bbUsername: z.string().min(3, "Bitbucket Username is required"),
  bbPassword: z.string().min(6, "Bitbucket Password is required"),
});

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      bbUsername: "",
      bbPassword: "",
    },
  });

  const mutationSignIn = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "bitbucket",
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
        },
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: any) => {
    mutationSignIn.mutate(data);
  };

  return (
    <div className="fixed w-full h-full flex items-center justify-center">
      <Button
        onClick={() => mutationSignIn.mutate()}
        className="py-6 px-8 bg-blue-600 hover:bg-blue-500 text-white gap-2"
      >
        <LogoBitbucket />
        Continue with Bitbucket
      </Button>
    </div>
  );
}
