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
      const getURL = () => {
        let url =
          process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
          process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
          "http://localhost:3000/";
        // Make sure to include `https://` when not localhost.
        url = url.startsWith("http") ? url : `https://${url}`;
        // Make sure to include a trailing `/`.
        url = url.endsWith("/") ? url : `${url}/`;
        return url;
      };
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "bitbucket",
        options: {
          redirectTo: getURL(),
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
