"use client";

import { TypographyH1 } from "@/components/typography/typography-h1";
import ButtonLoading from "@/components/ui/button-loading";
import { crmGetFunction, crmGetFunctions } from "@/helpers/zoho/crm";
import { supabase } from "@/lib/supabase/client";
import { Project } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import {
  ALargeSmall,
  ArrowUpFromLine,
  RefreshCcw,
  WholeWord,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CodeViewer from "@/components/shared/code-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectStore } from "@/stores/project";
import { formatInTimeZone } from "date-fns-tz";
import DialogSettingsCRM from "@/components/shared/dialog-settings-crm";
import { useSearch } from "@/hooks/useSearch";
import SearchInput from "@/components/ui/search-input";
import {
  bitbucketCommit,
  bitbucketCreateRepository,
  bitbucketGetRepository,
} from "@/helpers/bitbucket";
import Description from "@/components/ui/description";
import { time } from "@/utils/generic";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { format } from "date-fns";
import { useGlobalStore } from "@/stores/global";

export default function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const { username } = params;
  const { user, getUser } = useGlobalStore();
  const { project, getProject } = useProjectStore();

  const mutationRefresh = useMutation({
    mutationFn: async () => {
      if (!project) throw new Error("Project data is not available.");

      const functions = await crmGetFunctions(
        project.domain,
        project.crm?.config
      );

      const functionsWithCode = await Promise.all(
        (functions || []).map((functionInfo: any) =>
          crmGetFunction(project.domain, project.crm?.config, functionInfo)
        )
      );

      const { error } = await supabase.from("crm").upsert({
        id: project.crm?.id,
        projectId: project.id,
        functions: functionsWithCode.filter((x: any) => !!x.id),
        lastSync: formatInTimeZone(
          new Date(),
          "Europe/Lisbon",
          "yyyy-MM-dd'T'HH:mm:ss"
        ),
      });

      if (error) throw new Error("Failed to update project functions");
    },
    onSuccess: () => {
      getProject(username);
      toast.success("Project functions updated successfully.");
    },
    onError: (err) => {
      toast.error(err.message || "Mutation failed. Please try again.");
    },
  });

  const mutationPushToGit = useMutation({
    mutationFn: async () => {
      const name = `loba-projects_${project?.username}`;

      const auth = {
        username: user?.profile?.bbUsername,
        password: user?.profile?.bbPassword,
      };

      let repository = await bitbucketGetRepository(auth, name);
      if (!repository) repository = await bitbucketCreateRepository(auth, name);

      const formData = new FormData();
      project?.crm?.functions.forEach((func) => {
        formData.append(`crm/functions/${func.display_name}.dg`, func.workflow);
      });

      await bitbucketCommit(
        auth,
        name,
        formData,
        format(new Date(), "dd-MM-yyyy HH:mm:ss")
      );
    },
    onSuccess: () => {
      toast.success("Functions pushed successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Error pushing to git");
    },
  });

  const { data, filters, setFilters } = useSearch(
    project?.crm?.functions || [],
    "script",
    ["display_name"]
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-end">
        <div className="flex gap-2">
          <TypographyH1>Zoho CRM</TypographyH1>
          <DialogSettingsCRM />
        </div>
      </div>
      {project?.crm && (
        <>
          {/* <div className="flex gap-2">
            {["Functions", "Client Script"].map((item: any, index) => (
              <Button
                key={index}
                variant={false ? "default" : "outline"}
                size="sm"
              >
                {item}
              </Button>
            ))}
          </div> */}
          <div className="flex items-end">
            <div className="grid">
              <TypographyH2>Functions</TypographyH2>
              <Description>
                Last sync occurred {time.timeAgo(project?.crm?.lastSync)}
              </Description>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <ButtonLoading
                variant="secondary"
                icon={ArrowUpFromLine}
                loading={mutationPushToGit.isPending}
                onClick={() => mutationPushToGit.mutate()}
              >
                <span>Push to Git</span>
              </ButtonLoading>
              <ButtonLoading
                icon={RefreshCcw}
                loading={mutationRefresh.isPending}
                onClick={() => mutationRefresh.mutate()}
              >
                <span>Sync</span>
              </ButtonLoading>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <SearchInput
              placeholder="Search for function name or code"
              filters={filters}
              setFilters={setFilters}
            />
            <Description className="mt-4">
              Total functions: {project?.crm?.functions?.length || 0}
            </Description>
            {data?.map((func: any, index: number) => (
              <Dialog key={index}>
                <DialogTrigger>
                  <Button key={index} variant="outline" className="w-full">
                    {func?.display_name}
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-max !w-7/12 max-h-[500px] overflow-auto">
                  <DialogTitle className="border-b pb-4">
                    {func?.display_name}
                  </DialogTitle>
                  <div className="overflow-auto min-w-96p">
                    <CodeViewer script={func?.workflow} />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
