'use client';

import React, { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { queryClient } from '@/providers/react-query-provider';
import { DataTableAdvancedFilterField } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Ban,
  Check,
  ChevronDown,
  Clipboard,
  ClipboardIcon,
  EraserIcon,
  Eye,
  Info,
  PauseCircle,
  PlayCircle,
  Trash2,
  TrashIcon,
} from 'lucide-react';
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server';
import { toast } from 'sonner';
import { z } from 'zod';

import { DataTable } from '@/components/data-table/data-table';
import { RowAction, TableData } from '@/components/data-table/data-table-config';
import { DataTableFilterField } from '@/components/data-table/data-table-faceted-filter';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import MainContainer from '@/components/layout/main-container';
import ButtonDeleteProjectLogs from '@/components/shared/button-delete-project-logs';
import DialogViewLogNotes from '@/components/shared/dialog-view-log-notes';
import { Button } from '@/components/ui/button';
import ButtonLoading from '@/components/ui/button-loading';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGlobalStore } from '@/stores/global';
import { useProjectStore } from '@/stores/project';
import { useDataTable } from '@/hooks/use-data-table';
import { LOGS_TYPES } from '@/utils/constants';
import { logExamples } from '@/utils/log-examples';
import { getFiltersStateParser, getSortingStateParser } from '@/utils/parsers';
import { applyFiltersParamsToQuery } from '@/utils/query';

import { advancedFilterField, columns, columnsSearchParams, filterFields } from './columns';

export default function Page({ params: { username } }: { params: { username: string } }) {
  const { project } = useProjectStore();

  const [realtime, setRealtime] = useState(true);
  const [rowAction, setRowAction] = useState<RowAction<LogTable> | null>(null);

  const [{ data, pageCount }, setData] = useState<TableData>({
    data: [],
    pageCount: 0,
  });

  const { table, search } = useDataTable<LogTable>({
    data: data || [],
    pageCount,
    columns: columns(setRowAction),
    filterFields: filterFields,
    columnsSearchParams: columnsSearchParams,
  });

  const queryLogs = useQuery({
    queryKey: ['project_logs', username, search],
    queryFn: async () => {
      let query = supabase
        .from('logs')
        .select('*, projects(id, name)', { count: 'exact' })
        .eq('projectUsername', username);

      if (Array.isArray(search.type) && search.type.length > 0) {
        query.in('type', search.type);
      }
      if (search.function) {
        query.ilike('function', `%${search.function}%`);
      }

      const response = await applyFiltersParamsToQuery(query, search);

      setData({
        data: response.data,
        pageCount: Math.ceil(response.count / search.perPage),
      });

      return {
        data: response.data || [],
        count: response.count || 0,
      };
    },
  });

  useEffect(() => {
    if (!realtime) return;

    const changes = supabase
      .channel('table-logs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'logs',
          filter: `projectUsername=eq.${username}`,
        },
        async (payload) => {
          const log = payload.new;
          setData((prev) => {
            return {
              ...prev,
              data: [log, ...(prev?.data || [])],
            };
          });

          queryClient.setQueryData(['logs'], (prev: any[]) => {
            return [log, ...(prev || [])];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(changes);
    };
  }, [realtime]);

  return (
    <>
      <MainContainer
        breadcrumbs={[
          {
            label: 'Projects',
            href: '/projects',
          },
          {
            label: project?.name || '',
            href: `/projects/${project?.username}`,
          },
          { label: 'Logs' },
        ]}
      >
        <DataTable
          table={table}
          loadingConfig={{
            isLoading: queryLogs.isPending,
            layout: {
              columns: 5,
              columnWidths: ['100px', '380px', '300px', '140px', '50px'],
            },
          }}
        >
          <DataTableToolbar table={table} filterFields={filterFields} advancedFilterField={advancedFilterField}>
            <Button variant={realtime ? 'destructive' : 'outline'} size="sm" onClick={() => setRealtime((val) => !val)}>
              Realtime
              {realtime ? <PauseCircle /> : <PlayCircle />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm">
                  Copy Request
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {logExamples.map((example) => (
                  <DropdownMenuItem
                    key={example.label}
                    onClick={() => {
                      const code = example.code(username);
                      navigator.clipboard.writeText(code);
                      toast.success(`Copied ${example.label} request to clipboard`);
                    }}
                  >
                    <ClipboardIcon className="mr-2" />
                    {example.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ButtonDeleteProjectLogs username={username} onSuccess={queryLogs.refetch} />
          </DataTableToolbar>
        </DataTable>
      </MainContainer>

      <DialogViewLogNotes
        rowAction={rowAction}
        open={rowAction?.action === 'view'}
        onOpenChange={(open) => !open && setRowAction(null)}
      />
    </>
  );
}
