'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { DataTableAdvancedFilterField } from '@/types';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { DataTableFacetedFilter, DataTableFilterField } from '@/components/data-table/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import DataTableAdvancedFilter from './data-table-advanced-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  /**
   * An array of filter field configurations for the data table.
   * When options are provided, a faceted filter is rendered.
   * Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields?: DataTableFilterField<TData>[];
  advancedFilterField?: DataTableAdvancedFilterField<TData>[];
  hideViewOptions?: boolean;
  fitScreen?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  advancedFilterField = [],
  fitScreen,
  children,
  className,
  hideViewOptions,
  ...props
}: DataTableToolbarProps<TData>) {
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  const [filters, setFilters] = useQueryState('filters');
  const [_, setJoinOperator] = useQueryState('joinOperator');

  const resetFilters = () => {
    table.resetColumnFilters();
    void setFilters(null);
    void setJoinOperator(null);
  };

  const isFiltered = table.getState().columnFilters.length > 0 || filters;

  return (
    <div className={cn('flex w-full items-center justify-between gap-2 overflow-visible', className)} {...props}>
      <div className="flex flex-1 items-center gap-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <Input
                  key={String(column.id)}
                  placeholder={column.placeholder}
                  value={(table.getColumn(String(column.id))?.getFilterValue() as string) ?? ''}
                  onChange={(event) => table.getColumn(String(column.id))?.setFilterValue(event.target.value)}
                  className={cn('h-8 w-40 lg:w-64', fitScreen && '!w-full')}
                />
              ),
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : '') && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : '')}
                  title={column.label}
                  options={column.options ?? []}
                />
              ),
          )}

        {advancedFilterField.length > 0 && <DataTableAdvancedFilter table={table} filterFields={advancedFilterField} />}

        {isFiltered && (
          <Button aria-label="Reset filters" variant="ghost" className="h-8 px-2 lg:px-3" onClick={resetFilters}>
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      {(!!children || !hideViewOptions) && (
        <div className="flex items-center gap-2">
          {children}
          {!hideViewOptions && <DataTableViewOptions table={table} />}
        </div>
      )}
    </div>
  );
}
