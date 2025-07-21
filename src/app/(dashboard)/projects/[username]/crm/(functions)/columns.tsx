'use client';

import { time } from 'console';
import { type } from 'os';

import { DataTableAdvancedFilterField, DataTableFilterField } from '@/types';
import { Workflow } from '@/types/crm';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { ColumnDef } from '@tanstack/react-table';
import { JsonViewer } from '@textea/json-viewer';
import { format } from 'date-fns';
import { AlertTriangle, Ban, Check, Eye, FileJson2, Info } from 'lucide-react';
import { parseAsArrayOf, parseAsString } from 'nuqs';
import { z } from 'zod';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { RowAction } from '@/components/data-table/data-table-config';
import DialogViewLogNotes from '@/components/shared/dialog-view-log-notes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogHeader } from '@/components/ui/dialog';
import { SearchParamsConfig } from '@/hooks/use-data-table';
import { LOGS_TYPES, LOGS_TYPES_COLORS } from '@/utils/constants';

import { WorkflowSearch } from './tab';

export const columns = (setRowAction: (action: RowAction<Workflow>) => void): ColumnDef<WorkflowSearch>[] => [
  {
    id: 'search',
    accessorKey: 'display_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="projectId" />,
    cell: ({ row }) => <span>{row.getValue('display_name')}</span>,
    filterFn: (row, id, value) => {
      console.log(row, id, value);
      return false;
    },
  },
  {
    id: 'script',
    accessorKey: 'script',
    header: ({ column }) => <DataTableColumnHeader column={column} title="code" />,
    cell: ({ row }) => <span>{row.getValue('script')}</span>,
  },
];

export const filterFields: DataTableFilterField<WorkflowSearch>[] = [
  {
    id: 'search',
    label: 'Search',
    placeholder: 'Search for name or code',
  },
];

export const advancedFilterField: DataTableAdvancedFilterField<Workflow>[] = [
  {
    id: 'display_name',
    label: 'Display Name',
    placeholder: 'Display Name',
    type: 'text',
  },
  {
    id: 'script',
    label: 'Function Code',
    placeholder: 'Function Code',
    type: 'text',
  },
  {
    id: 'return_type',
    label: 'Return Type',
    placeholder: 'Return Type',
    type: 'select',
    options: ['STRING', 'VOID', 'MAP'].map((v) => ({ label: v, value: v })),
  },
];

export const columnsSearchParams = {
  search: parseAsString.withDefault(''),
} as SearchParamsConfig<WorkflowSearch>;
