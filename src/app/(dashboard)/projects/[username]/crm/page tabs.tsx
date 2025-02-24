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
  Book,
  Meh,
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
import { arr, str, time } from "@/utils/generic";
import { TypographyH2 } from "@/components/typography/typography-h2";
import { format } from "date-fns";
import { useGlobalStore } from "@/stores/global";
import ScriptViewer from "@/components/shared/code-viewer";
import { CRMFunctions } from "@/types/applications";
import { LinkNavTabs } from "@/components/vercel/link-nav-tabs";
import Link from "next/link";
import { ButtonNavTabs } from "@/components/vercel/button-nav-tabs";
import LogoCrm from "@/assets/img/logo-crm";
import { TypographyH3 } from "@/components/typography/typography-h3";
import SettingsCRM from "@/components/shared/crm/settings";

const TABS = [
  { id: "tab_functions", label: "Functions" },
  { id: "tab_clientscript", label: "Client Scripts" },
];

export default function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const { username } = params;
  const { user } = useGlobalStore();
  const { project, getProject } = useProjectStore();
  const [tab, setTab] = useState<any>(TABS[0].id);

  const [activeFunction, setActiveFunction] = useState<CRMFunctions | null>(
    null
  );

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

  const groupBy = arr.groupBy(data, "category") || {};

  return (
    <div className="flex flex-col">
      <div className="px-4 flex items-center gap-4 text-xs pb-10">
        <LogoCrm size={30} />
        <TypographyH1>Zoho CRM</TypographyH1>
        <DialogSettingsCRM />
      </div>
      <ButtonNavTabs tabs={TABS} activeTabId={tab} toggle={setTab} springy />

      {project?.crm && (
        <div className="flex flex-col py-10">
          {tab === "tab_functions" && (
            <>
              <TypographyH2 className>Functions</TypographyH2>
              {/* Information & Buttons */}
              <div className="flex items-center">
                {project?.crm?.lastSync && (
                  <div className="flex flex-col mt-4 gap-2">
                    <Description className="flex items-center gap-2">
                      <RefreshCcw className="size-3" />
                      Last sync occurred {time.timeAgo(project?.crm?.lastSync)}
                    </Description>
                    <Description className="flex items-center gap-2">
                      <ArrowUpFromLine className="size-3" />
                      Last commit occurred{" "}
                      {time.timeAgo(project?.crm?.lastSync)}
                    </Description>
                  </div>
                )}
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
              {/* Functions */}
              <div>
                {project?.crm?.functions?.length ? (
                  <div className="flex flex-col gap-4 mt-10">
                    <SearchInput
                      placeholder="Search for function name or code"
                      filters={filters}
                      setFilters={setFilters}
                    />
                    <div className="grid grid-cols-3 gap-x-10 rounded-2xl">
                      <div className="flex flex-col text-sm gap-10">
                        {Object.keys(groupBy).map(
                          (category: any, index: any) => {
                            const functions = groupBy[category];
                            return (
                              <div
                                key={index}
                                className="bg-primary-foreground p-8 rounded-2xl"
                              >
                                {/* Title */}
                                <div className="flex items-center gap-2">
                                  <Book className="size-4" />
                                  <span className="text-lg">{category}</span>
                                </div>
                                {/* Elements */}
                                {functions?.length > 0 && (
                                  <div className="mt-4 flex flex-col gap-2">
                                    {functions.map(
                                      (func: any, index: number) => (
                                        <Button
                                          key={index}
                                          size="sm"
                                          variant={
                                            func.id === activeFunction?.id
                                              ? "secondary"
                                              : "ghost"
                                          }
                                          className="text-sm justify-start truncate"
                                          onClick={() =>
                                            setActiveFunction(func)
                                          }
                                        >
                                          {str.decodeHtmlSpecialChars(
                                            func.display_name
                                          )}
                                        </Button>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="bg-primary-foreground col-span-2 p-8 rounded-2xl h-[calc(100vh-40px)] sticky top-4 overflow-auto">
                        <ScriptViewer script={activeFunction?.workflow} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full gap-4">
                    <Meh />
                    <TypographyH1>
                      No functions have been added yet
                    </TypographyH1>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "tab_settings" && <SettingsCRM />}
        </div>
      )}
    </div>
  );
}
