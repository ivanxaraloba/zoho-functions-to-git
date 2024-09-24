"use client";

import LogoBitbucket from "@/assets/img/logo-bitbucket";
import ButtonLoading from "@/components/ui/button-loading";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { TypographyH1 } from "@/components/typography/typography-h1";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const mutationSignIn = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "bitbucket",
        options: {
          redirectTo: process?.env?.NEXT_PUBLIC_SITE_URL,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      window.location.href = data.url;
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="fixed w-full h-full flex items-center justify-center">
      <Button
        onClick={() => mutationSignIn.mutate()}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-7 flex items-center gap-4"
      >
        <LogoBitbucket />
        Continue with Bitbucket
      </Button>
    </div>
  );
}
