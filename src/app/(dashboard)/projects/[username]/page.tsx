"use client";

import { useRouter } from "next/navigation";
import { TypographyH1 } from "@/components/typography/typography-h1";
import ButtonLoading from "@/components/ui/button-loading";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useProjectStore } from "@/stores/project";
import { str } from "@/utils/generic";

export default function Page() {
  const router = useRouter();
  const { project, getProject } = useProjectStore();

  const mutationDeleteProject = useMutation({
    mutationFn: async () => {
      if (!project) throw new Error("Project data is not available");

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => {
      router.push("/");
      toast.success("Project deleted successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Error");
    },
  });

  if (!project) return <p>Loading...</p>;

  console.log(str.slugify(project.name));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-end">
        <TypographyH1>{project.name}</TypographyH1>
        <div className="ml-auto flex items-center gap-2">
          <ButtonLoading
            variant="destructive"
            icon={Trash}
            loading={mutationDeleteProject.isPending}
            onClick={() => mutationDeleteProject.mutate()}
          >
            <span>Delete</span>
          </ButtonLoading>
        </div>
      </div>
    </div>
  );
}
