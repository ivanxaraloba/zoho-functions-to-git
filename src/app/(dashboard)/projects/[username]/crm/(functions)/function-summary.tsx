import React from 'react';

import { IBitbucketRepository, IFunctionCrm } from '@/types/fixed-types';
import { ArrowUpFromLine, Parentheses, RefreshCcw, Settings2Icon, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';

import { AppTabDescription } from '@/components/layout/app-tab';
import { TypographyH2 } from '@/components/typography/typography-h2';
import ButtonLoading from '@/components/ui/button-loading';
import Description from '@/components/ui/description';
import { DEPARMENTS } from '@/utils/constants';
import { getRepositoryName, time } from '@/utils/generic';

interface IFunctionSummary {
  project: ProjectTable;
  repository: IBitbucketRepository | null;
  crm: CRMTable;
  functions: IFunctionCrm[];
}

export default function FunctionSummary({ project, repository, crm, functions }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="">
        <TypographyH2 className="pb-3">Functions</TypographyH2>
        <div className="space-y-2">
          <AppTabDescription icon={Parentheses}>A total of {functions?.length || 0} functions</AppTabDescription>

          <AppTabDescription icon={RefreshCcw}>
            Last sync occurred {time.timeAgo(crm?.lastSync) || '-'}
          </AppTabDescription>

          {!!repository && project?.departmentId === DEPARMENTS.INTERNOS && (
            <AppTabDescription icon={ArrowUpFromLine}>
              Last commit occurred {time.timeAgo(crm?.lastCommit) || '-'}
            </AppTabDescription>
          )}

          {/* {!!repository && !!crm?.lastCommit && (
          <Description className="mt-4 flex items-center gap-2">
            <Link
              target="_blank"
              className="flex items-center gap-2"
              href={`https://bitbucket.org/lobadev/${getRepositoryName(project.domain, project.username)}/src/master/crm/functions`}
            >
              Open Bitbucket Repository
              <SquareArrowOutUpRight className="size-3" />
            </Link>
          </Description>
        )} */}
        </div>
      </div>
      <div className="space-x-2">
        <ButtonLoading variant="secondary" size="sm" icon={Settings2Icon}>
          Config
        </ButtonLoading>
        <ButtonLoading disabled variant="secondary" size="sm" icon={ArrowUpFromLine}>
          Push
        </ButtonLoading>
        <ButtonLoading variant="default" size="sm" icon={RefreshCcw}>
          Sync
        </ButtonLoading>
      </div>
    </div>
  );
}
