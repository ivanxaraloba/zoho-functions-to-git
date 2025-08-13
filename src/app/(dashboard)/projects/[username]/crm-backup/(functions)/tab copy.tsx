'use client';

import React, { useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { crmGetFunction, crmGetFunctions } from '@/lib/zoho/crm';
import { Workflow } from '@/types/crm';
import { Commit } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  ArrowUpFromLine,
  ArrowUpRightFromSquare,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  CircleFadingArrowUp,
  Frown,
  LucideAArrowDown,
  Parentheses,
  RefreshCcw,
  SearchX,
  SquareArrowOutUpRight,
  TriangleAlert,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import CardContainer from '@/components/shared/card-container';
import ListHeaderFunction from '@/components/shared/list-header-functions';
import ListItemFunction from '@/components/shared/list-item-function';
import PopoverFilters from '@/components/shared/popover-filters';
import ScriptViewer from '@/components/shared/script-viewer';
import SectionMissing from '@/components/shared/section-missing';
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
import { useProjectStore } from '@/stores/project';
import { useDataTable } from '@/hooks/use-data-table';
import { useFilters } from '@/hooks/use-filters';
import { DEPARMENTS, FUNCTIONS_CATEGORIES_LIST, FUNCTIONS_CATEGORIES_OBJ } from '@/utils/constants';
import { matchByWords } from '@/utils/filters';
import { arr, time } from '@/utils/generic';

import { columns, columnsSearchParams, filterFields } from './columns';

const PATH_TAB = 'crm/functions';

export default function TabFunctions({ username }: { username: string }) {
  const { project, getProject, getCRM } = useProjectStore();
  const [activeFn, setActiveFn] = useState<Workflow | null>(null);
  const [rowAction, setRowAction] = useState<RowAction<Workflow> | null>(null);
  const [{ data, pageCount }, setData] = useState<TableData>({
    data: [],
    pageCount: 0,
  });

  const { table, search } = useDataTable<Workflow>({
    data: data || [],
    pageCount,
    columns: columns(setRowAction),
    filterFields: filterFields,
    columnsSearchParams: columnsSearchParams,
  });

  const queryApp = useQuery({
    queryKey: ['project_crm_functions', username, search],
    queryFn: async () => {
      if (!project?.id) throw new Error('Project Id is Null');

      const response = await supabase
        .from('crm')
        .select('id, functions, config, lastSync, lastCommit, created_at')
        .eq('projectId', project?.id)
        .single();

      setData({
        data: Array.isArray(response.data?.functions) ? response.data.functions : [],
        pageCount: 0,
      });
    },
    enabled: !!project?.id,
  });

  const groupedByCategory = arr.groupInArr(data, 'category') as { items: Workflow[]; label: string }[];

  return (
    <>
      <div className="grid h-[calc(100vh-48px)] grid-cols-[320px_1fr] overflow-hidden bg-background">
        <ScrollArea className="overflow-auto border-r bg-card p-2">
          <div className="space-y-4">
            <div className="space-y-0">
              {groupedByCategory.map((group) => (
                <Collapsible className="group" defaultChecked={false} key={group.label}>
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
                          className="h-auto w-full justify-start font-normal"
                          onClick={() => setActiveFn(fn)}
                        >
                          <span className="truncate text-xs">{fn.display_name}</span>
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </ScrollArea>
        <ScrollArea className="h-full w-full overflow-auto px-3 py-1">
          {activeFn && <ScriptViewer className="h-full w-full" value={activeFn?.workflow} />}
        </ScrollArea>
        {/* <div className="border-l bg-card p-2">
          <div className="">
            <span className="font-semibold">Functions</span>
            <div className="mt-2 space-y-1 text-xs">
              <AppTabDescription icon={Parentheses}>
                <span className="text-xs">A total of 435 functions</span>
              </AppTabDescription>
              <AppTabDescription icon={Parentheses}>A total of 435 functions</AppTabDescription>
              <AppTabDescription icon={Parentheses}>A total of 435 functions</AppTabDescription>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
