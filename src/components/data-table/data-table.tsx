import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Column,
  flexRender,
  type Table as TanstackTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Skeleton } from '../ui/skeleton';
import { DataTablePagination } from './data-table-pagination';

interface LoadingConfig {
  /**
   * Whether the table is in a loading state
   */
  isLoading: boolean;

  /**
   * Configuration for skeleton layout
   */
  layout: {
    /**
     * Number of columns to show in loading state
     */
    columns: number;

    /**
     * Number of rows to show in loading state
     * @default 10
     */
    rows?: number;

    /**
     * Width of each column in the skeleton
     * @example ['100px', '200px', '150px']
     */
    columnWidths?: string[];
  };
}

interface DataTableProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>;
  floatingBar?: React.ReactNode | null;
  loadingConfig?: LoadingConfig;
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  loadingConfig,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn('w-full space-y-2.5 overflow-auto', className)}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-xs"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loadingConfig?.isLoading ? (
              Array.from({
                length: loadingConfig.layout.rows || 10,
              }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {Array.from({
                    length: loadingConfig.layout.columns,
                  }).map((_, j) => (
                    <TableCell
                      key={j}
                      style={{
                        width: loadingConfig.layout.columnWidths?.[j],
                      }}
                    >
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-xs"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 &&
          floatingBar}
      </div>
    </div>
  );
}
