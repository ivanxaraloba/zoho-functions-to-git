'use client';

import React, { useMemo, useState } from 'react';

import { getRepository } from '@/lib/bitbucket';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { crmGetFunction, crmGetFunctions } from '@/lib/zoho/crm';
import { crmFunction, Workflow } from '@/types/crm';
import { IBitbucketRepository, IFunctionCrm, IFunctionCrmRaw } from '@/types/fixed-types';
import { Commit } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  ArrowUpFromLine,
  ArrowUpRightFromSquare,
  Ban,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleFadingArrowUp,
  CircleFadingArrowUpIcon,
  CircleMinus,
  CircleOff,
  Dot,
  Frown,
  History,
  HistoryIcon,
  LucideAArrowDown,
  Parentheses,
  RefreshCcw,
  SearchX,
  ShieldAlert,
  SquareArrowOutUpRight,
  TriangleAlert,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';
import { toast } from 'sonner';

import { DataTable } from '@/components/data-table/data-table';
import { RowAction, TableData } from '@/components/data-table/data-table-config';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import {
  AppTabContent,
  AppTabContentBody,
  AppTabContentHead,
  AppTabContentMissing,
  AppTabDescription,
  AppTabHeader,
} from '@/components/layout/app-tab';
import ButtonCommitsHistory from '@/components/shared/button-commits-history';
import { ButtonCommitsNew } from '@/components/shared/button-commits-new';
import ButtonGenerateDoc from '@/components/shared/button-generate-doc';
import { ButtonPush } from '@/components/shared/button-push';
import CardCommit from '@/components/shared/card-commit';
import CardContainer from '@/components/shared/card-container';
import ListHeaderFunction from '@/components/shared/list-header-functions';
import ListItemFunction from '@/components/shared/list-item-function';
import PopoverFilters from '@/components/shared/popover-filters';
import ScriptViewer from '@/components/shared/script-viewer';
import SectionMissing from '@/components/shared/section-missing';
import TooltipIcon from '@/components/shared/tooltip-icon';
import { TypographyH2 } from '@/components/typography/typography-h2';
import { TypographyH3 } from '@/components/typography/typography-h3';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ButtonLoading from '@/components/ui/button-loading';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Description from '@/components/ui/description';
import { Input } from '@/components/ui/input';
import InputSearch from '@/components/ui/input-search';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useGlobalStore } from '@/stores/global';
import { useProjectStore } from '@/stores/project';
import { useDataTable } from '@/hooks/use-data-table';
import { useFilters } from '@/hooks/use-filters';
import { DEPARMENTS, FUNCTIONS_CATEGORIES_LIST, FUNCTIONS_CATEGORIES_OBJ } from '@/utils/constants';
import { matchByWords } from '@/utils/filters';
import { arr, getRepositoryName, time } from '@/utils/generic';
import { applyFiltersParamsToQuery } from '@/utils/query';
import LogoBitbucket from '@/assets/img/logo-bitbucket';

import { Json } from '../../../../../../../database.types';
import { advancedFilterField, columns, columnsSearchParams, filterFields } from './columns';
import FunctionSummary from './function-summary';

const PATH_TAB = 'crm/functions';

export interface WorkflowSearch extends Workflow {
  search?: string;
}

export default function TabFunctions({ username }: { username: string }) {
  const { user } = useGlobalStore();
  const { project, getProject, getCRM } = useProjectStore();

  const [showCommits, setShowCommits] = useState(false);
  const [activeFnId, setActiveFnId] = useQueryState('function', parseAsString.withDefault(''));
  const [activeCommitId, setActiveCommitId] = useQueryState('commit', parseAsString.withDefault(''));

  const [rowAction, setRowAction] = useState<RowAction<Workflow> | null>(null);
  const [{ data, pageCount }, setData] = useState<TableData>({
    data: [],
    pageCount: 0,
  });

  const { table, search } = useDataTable<WorkflowSearch>({
    data: data || [],
    pageCount,
    columns: columns(setRowAction),
    filterFields: filterFields,
    columnsSearchParams: columnsSearchParams,
    initialState: {
      perPage: 2000,
      sorting: [{ id: 'updatedTime', desc: false }],
    },
  });

  const queryCrm = useQuery<{
    id: CRMTable['id'];
    config: CRMTable['config'];
    created_at: CRMTable['created_at'];
    lastCommit: CRMTable['lastCommit'];
    lastSync: CRMTable['lastSync'];
  } | null>({
    queryKey: ['project_crm_functions_2', username],
    queryFn: async () => {
      if (!project?.id) throw new Error('Project Id is Null');
      const response = await supabase
        .from('crm')
        .select('id, config, lastSync, lastCommit, created_at')
        .eq('projectId', project?.id)
        .single();
      return response.data || null;
    },
    enabled: !!project?.id,
  });

  const queryFunctions = useQuery<CRMFunctionsTable[]>({
    queryKey: ['project_crm_functions_3', username, search],
    queryFn: async () => {
      if (!project?.id) throw new Error('Project Id is Null');
      let query = supabase.from('crmFunctions').select('*').eq('crmProjectId', project?.id);

      if (search.search) {
        query = query.or(`display_name.ilike.%${search.search}%,script.ilike.%${search.search}%`);
      }

      const response = await applyFiltersParamsToQuery(query, search);
      console.log(response);
      return response.data || [];
    },
    enabled: !!project?.id,
  });

  const activeFn = useMemo(() => {
    return queryFunctions.data?.find((fn) => fn.id === activeFnId) || null;
  }, [activeFnId, queryFunctions.data]);

  const queryCommits = useQuery<any>({
    queryKey: ['crm_functions_commits', username],
    queryFn: async () => {
      if (!project?.id) throw new Error('Project Id is Null');

      const { data, error } = await supabase
        .from('commits')
        .select('*, users(*), projects(*)')
        .eq('projectId', project?.id)
        .eq('path', PATH_TAB)
        .order('created_at', { ascending: false });

      return {
        arr: data,
        obj: arr.groupInObj(data, 'functionId'),
        pending: (data || []).filter((c: CommitsTable) => c.status === 'pending'),
      };
    },
  });

  const activeCommit = useMemo(() => {
    console.log(activeFnId);
    console.log(queryCommits.data?.arr);

    const find =
      queryCommits.data?.arr?.find((c: Commit) => String(c.id) === activeCommitId && c.functionId === activeFnId) ||
      null;

    if (!find) setActiveCommitId(null);

    return find;
  }, [activeCommitId, activeFnId, queryCommits.data]) as Commit;
  console.log({ activeCommit });

  const { data: repository } = useQuery<IBitbucketRepository>({
    queryKey: ['repository', username],
    queryFn: async () => {
      if (!project?.id) throw new Error('Project Id is Null');
      const response = await getRepository(getRepositoryName(project.domain, project.username));
      return response.data;
    },
    enabled: !!project?.id,
  });

  const groupedByCategory = arr.groupInArr(queryFunctions.data || [], 'category') as {
    items: IFunctionCrm[];
    label: string;
  }[];

  const mutationRefresh = useMutation({
    mutationFn: async () => {
      try {
        if (!project || !queryCrm.data?.config) throw new Error('Project/crmApp data is not available.');

        const { data: rawFns, error: fetchError } = await crmGetFunctions(project.domain, queryCrm.data.config);
        if (fetchError || !rawFns) throw new Error('Failed to fetch functions');

        const lastSync = queryCrm.data?.lastSync;
        const recentFns = !lastSync
          ? rawFns
          : rawFns.filter(({ updatedTime, createdTime }) => {
              const fixed = time.fixTime(lastSync);
              return updatedTime >= fixed || createdTime >= fixed;
            });

        const recentFnsWithCode = await Promise.all(
          recentFns.map(async (fn) => {
            const { data, error } = await crmGetFunction(project.domain, queryCrm.data.config, fn);
            if (error || !data) return null;

            const { modified_on, ...cleanData } = data;
            return { ...cleanData, crmProjectId: project.id };
          }),
        );

        console.log({ recentFnsWithCode });

        const validFns = recentFnsWithCode.filter(Boolean);
        console.log({ validFns });
        const responseF = await supabase.from('crmFunctions').upsert(validFns);
        console.log({ responseF });

        if (responseF.error) throw responseF.error;
      } catch (err) {
        console.error('mutationRefresh error:', err);
      }

      return true;
    },
    onSuccess: async () => {
      console.log('SUCCESSS');
    },
    onError: (err) => {
      console.log('ERROR');
      console.log('Mutation failed:', err);
    },
  });

  console.log(queryCommits.data);

  return (
    <>
      <FunctionSummary project={project} repository={repository} crm={queryCrm.data} functions={queryFunctions.data} />
      <div className="mt-6 flex flex-col gap-2.5">
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          advancedFilterField={advancedFilterField}
          hideViewOptions
          fitScreen
        />
        <div className="grid h-[calc(100vh-90px)] grid-cols-5 gap-4">
          <CardContainer className="h-full space-y-1 overflow-auto">
            {queryFunctions.isPending && (
              <>
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-9" />
                ))}
              </>
            )}
            {groupedByCategory.map((group) => (
              <Collapsible className="group" defaultOpen key={group.label}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="h-auto w-full justify-between p-2">
                    <div className="flex items-center gap-2 font-normal">
                      <ChevronRight className="hidden size-4 group-data-[state=closed]:block" />
                      <ChevronDown className="block size-4 group-data-[state=closed]:hidden" />
                      <span className="text-xs capitalize">{group.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {group.items.length}
                    </Badge>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6">
                  <div className="space-y-1 py-2">
                    {group.items.map((fn, index) => (
                      <Button
                        key={fn.id}
                        variant={fn.id === activeFn?.id ? 'secondary' : 'ghost'}
                        className="relative h-auto w-full justify-start font-normal"
                        onClick={() => setActiveFnId(fn.id)}
                      >
                        <span className="truncate text-xs">{fn.display_name}</span>
                        <div className="ml-auto space-x-2">
                          {fn.script?.length < 50 && (
                            <TooltipIcon icon={Ban} text="Function is too short" className="text-red-400" />
                          )}
                          {!queryCommits.data?.obj[fn.id] && (
                            <TooltipIcon icon={CircleMinus} text={'Never commited'} className="text-gray-400" />
                          )}
                          {time.fixTime(fn.updatedTime) >= queryCrm.data?.lastCommit && (
                            <TooltipIcon
                              icon={CircleFadingArrowUp}
                              text="Ready to commit"
                              className="text-yellow-400"
                            />
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContainer>
          <CardContainer className={cn('relative overflow-y-auto pt-0', showCommits ? 'col-span-3' : 'col-span-4')}>
            {activeFn && (
              <>
                <div className="bg-card sticky top-0 z-10 flex w-full items-center border-b py-4">
                  <div className="flex flex-col">
                    <div className="flex">
                      <span className="text-sm font-medium">{activeFn.display_name}</span>
                      {activeCommit?.id && (
                        <span className="ml-3 flex items-center gap-2">
                          <span className="text-muted-foreground text-xs font-medium">{activeCommit.message}</span>
                          {activeCommit.status === 'committed' ? (
                            <Check className="!size-3.5 text-green-400" />
                          ) : (
                            <CircleFadingArrowUp className="!size-3.5 text-amber-500" />
                          )}
                        </span>
                      )}
                    </div>
                    <Description>Last update: {time.friendlyTime(activeFn.updatedTime)}</Description>
                  </div>
                  <div className="ml-auto flex items-center">
                    <Link
                      target="_blank"
                      href={`https://bitbucket.org/lobadev/sasdsadas/src/master/${PATH_TAB}/${activeFn?.name}.dg`}
                    >
                      <Button variant="ghost" size="sm">
                        <LogoBitbucket className="!size-3.5" />
                      </Button>
                    </Link>
                    <Button onClick={() => setShowCommits(true)} variant="ghost" size="sm">
                      <History className="!size-3.5" />
                    </Button>
                  </div>
                </div>
                <ScriptViewer
                  className="h-full w-full pt-4"
                  value={activeCommit?.id ? activeCommit?.function?.script : activeFn?.script || ''}
                  highlightWord={String(search.search)}
                />
              </>
            )}
          </CardContainer>
          {!!activeFn && showCommits && (
            <CardContainer>
              <div className="flex">
                <span className="text-sm font-medium">Commits</span>
                <div className="ml-auto">
                  <Button onClick={() => setShowCommits(false)} variant="ghost" size="icon" className="!size-8">
                    <X className="!size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1 pt-2 pr-2">
                <div className="flex gap-2">
                  <Input placeholder="New commit message (e.g., feat: add feature)" />
                  <ButtonLoading size="sm" type="submit">
                    Commit
                  </ButtonLoading>
                </div>
                <Button
                  onClick={() => {
                    setActiveCommitId(null);
                  }}
                  variant={activeCommitId === null ? 'secondary' : 'ghost'}
                  className="h-full justify-start px-3 py-1.5"
                >
                  <div className="mr-2">
                    <Circle className="!size-3.5 text-gray-400" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="truncate text-sm font-medium">Current Version</span>
                    <span className="text-muted-foreground truncate text-xs font-normal">Last synced version</span>
                  </div>
                </Button>
                {queryCommits.data?.obj[activeFn.id].map((commit: Commit) => (
                  <Button
                    key={commit.id}
                    onClick={() => {
                      setActiveCommitId(String(commit.id));
                    }}
                    variant={activeCommitId === String(commit.id) ? 'secondary' : 'ghost'}
                    className="h-full justify-start px-3 py-1.5"
                  >
                    <div className="mr-2">
                      {commit.status === 'committed' ? (
                        <Check className="!size-3.5 text-green-400" />
                      ) : (
                        <CircleFadingArrowUp className="!size-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="truncate text-sm font-medium">{commit.message}</span>
                      <span className="text-muted-foreground truncate text-xs font-normal">
                        {commit.users.bbUsername}, {time.friendlyTime(commit.created_at)}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContainer>
          )}
        </div>
      </div>
    </>
  );
}
