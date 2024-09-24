import {
  bitbucketCommit,
  bitbucketCreateRepository,
  bitbucketGetRepository,
} from "@/helpers/bitbucket";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

const usePushToGit = (
  projectKey: string,
  functions: any[],
  pathPrefix: string
) => {
  return useMutation({
    mutationFn: async () => {
      const name = `loba-projects_${projectKey}`;

      let repository = await bitbucketGetRepository(name);
      if (!repository) repository = await bitbucketCreateRepository(name);

      const formData = new FormData();
      functions.forEach((func) => {
        formData.append(
          `${pathPrefix}/${func.display_name || func.WFName}.dg`,
          func.workflow || func.script
        );
      });

      await bitbucketCommit(
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
};
