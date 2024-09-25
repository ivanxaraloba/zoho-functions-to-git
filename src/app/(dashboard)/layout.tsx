"use client";

import Sidebar from "@/components/layout/sidebar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { PanelsTopLeft } from "lucide-react";
import FormSetupBitbucket from "@/components/shared/form-setup-bitbucket";
import { useGlobalStore } from "@/stores/global";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const routes = [
    {
      name: "Projects",
      icon: PanelsTopLeft,
      to: "/projects",
    },
  ];

  const { user, getUser } = useGlobalStore();

  useEffect(() => {
    getUser().then((fetchedUser) => {
      if (!fetchedUser) router.push("/login");
    });
  }, [getUser, router]);

  if (pathname.includes("/projects/")) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {!user?.profile && <FormSetupBitbucket />}
      <div>
        <Sidebar routes={routes} />
        <div className="ml-52">
          <div className="px-10 py-8">{children}</div>
        </div>
      </div>
    </>
  );
}
