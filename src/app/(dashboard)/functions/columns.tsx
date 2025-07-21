'use client';

import { DataTableFilterField } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';
import { parseAsArrayOf, parseAsString } from 'nuqs';
import { z } from 'zod';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { RowAction } from '@/components/data-table/data-table-config';
import BadgeApplication from '@/components/shared/badge-application';
import { Button } from '@/components/ui/button';
import { SearchParamsConfig } from '@/hooks/use-data-table';
import { APPLICATIONS_TYPES } from '@/utils/constants';

export const columns = (setRowAction: (action: RowAction<FunctionTable>) => void): ColumnDef<FunctionTable>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'applications',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applications" />,
    cell: ({ row }) => (
      <div className="flex items-center justify-start gap-2">
        {row.original?.applications.map((app: any) => <BadgeApplication key={app} application={app} />)}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      return row.original.applications.some((app: any) => filterValue.includes(app));
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{format(row.getValue('created_at'), 'dd-MM-yyyy HH:mm:ss')}</span>
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
        <ArrowUpRight className="size-3!" />
      </Button>
    ),
  },
];

export const filterFields: DataTableFilterField<FunctionTable>[] = [
  {
    id: 'name',
    label: 'Function Name',
    placeholder: 'Filter by function name...',
  },
  {
    id: 'applications',
    label: 'Applications',
    options: [
      {
        value: 'crm',
        label: 'CRM',
      },
      {
        value: 'creator',
        label: 'Creator',
      },
      {
        value: 'recruit',
        label: 'Recruit',
      },
    ],
  },
];

export const columnsSearchParams = {
  name: parseAsString.withDefault(''),
  applications: parseAsArrayOf(z.enum(APPLICATIONS_TYPES)).withDefault([]),
} as SearchParamsConfig<FunctionTable>;
