"use client";

import Sidebar from "@/components/layout/sidebar";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PanelsTopLeft } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if it's a project path
  if (pathname.includes("/projects/")) {
    return <>{children}</>;
  }

  const routes = [
    {
      name: "Projects",
      icon: PanelsTopLeft,
      to: "/projects",
    },
  ];

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        router.push("/login");
      } else if (!user?.email?.includes("@loba")) {
        router.push("/error");
      }

      setIsLoading(false);
    };
    fetchUser();
  }, [router]);

  if (isLoading) {
    return null;
  }

  return (
    user && (
      <div className="">
        <Sidebar routes={routes} />
        <div className="ml-52">
          <div className="px-10 py-8">{children}</div>
        </div>
      </div>
    )
  );
}
