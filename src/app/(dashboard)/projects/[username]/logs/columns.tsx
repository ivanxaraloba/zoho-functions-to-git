'use client';

import { time } from 'console';
import { type } from 'os';

import { DataTableAdvancedFilterField, DataTableFilterField } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { AlertTriangle, Ban, Check, Eye, FileJson2, Info } from 'lucide-react';
import { parseAsArrayOf, parseAsString } from 'nuqs';
import { z } from 'zod';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { RowAction } from '@/components/data-table/data-table-config';
import BadgeLogType from '@/components/shared/badge-log-type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchParamsConfig } from '@/hooks/use-data-table';
import { LOGS_TYPES, LOGS_TYPES_COLORS } from '@/utils/constants';

export const columns = (setRowAction: (action: RowAction<LogTable>) => void): ColumnDef<LogTable>[] => [
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => <BadgeLogType type={row.getValue('type')} />,
    filterFn: (row, columnId, filterValues) => {
      // Apply 'or' filtering logic
      return filterValues.some((val: any) => row.getValue(columnId) === val);
    },
  },
  {
    accessorKey: 'function',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Function" />,
    cell: ({ row }) => <span>{row.getValue('function')}</span>,
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Notes" />,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate overflow-hidden">{String(row.getValue('notes') || '').slice(0, 80)}</div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{format(row.getValue('created_at'), 'dd-MM-yyyy HH:mm:ss')}</span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Button variant="outline" className="size-6" size="icon" onClick={() => setRowAction({ row, action: 'view' })}>
        <Eye className="size-3!" />
      </Button>
    ),
  },
];

export const columnsSearchParams = {
  function: parseAsString.withDefault(''),
  type: parseAsArrayOf(z.enum(LOGS_TYPES)).withDefault([]),
  notes: parseAsString.withDefault(''),
} as SearchParamsConfig<FunctionTable>;

export const filterFields: DataTableFilterField<LogTable>[] = [
  {
    id: 'function',
    label: 'Function',
    placeholder: 'Filter by function name...',
  },
  {
    id: 'type',
    label: 'Type',
    options: [
      { value: 'info', label: 'Info', icon: Info },
      { value: 'error', label: 'Error', icon: Ban },
      { value: 'warning', label: 'Warning', icon: AlertTriangle },
      { value: 'success', label: 'Success', icon: Check },
    ],
  },
];

export const advancedFilterField: DataTableAdvancedFilterField<LogTable>[] = [
  {
    id: 'notes',
    label: 'Notes',
    placeholder: 'Notes',
    type: 'text',
  },
  {
    id: 'function',
    label: 'Function',
    placeholder: 'Function name',
    type: 'text',
  },
];
