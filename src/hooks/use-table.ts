import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';

import { useDebounce } from './use-debounce';
import { DataTableFilterField } from '@/components/data-table/data-table-faceted-filter';



interface TableOptions<TData = any> {
  selectColumnFilter?: string;
  columnVisibility?: VisibilityState;
  columnFilters?: ColumnFiltersState;
  rowSelection?: Record<string, boolean>;
  sorting?: SortingState;
  pagination?: { pageIndex: number; pageSize: number };
  filterFields?: DataTableFilterField<TData>[];
}

export function useTable<TData = any>({
  data = [],
  columns = [],
  options = {},
  pageCount,
}: {
  data: TData[];
  columns: any[];
  options?: TableOptions<TData> & { debounceMs?: number };
  pageCount: number;
}) {
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(options.columnVisibility || {});
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(options.columnFilters || []);
  const [rowSelection, setRowSelection] = useState<
    Record<string, boolean>
  >(options.rowSelection || {});
  const [sorting, setSorting] = useState<SortingState>(
    options.sorting || [{ id: 'created_at', desc: true }]
  );
  const [pagination, setPagination] = useState(
    options.pagination || { pageIndex: 0, pageSize: 10 },
  );
  const [selectColumnFilter, setSelectColumnFilter] = useState(
    options.selectColumnFilter || '',
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const debouncedColumnFilters = useDebounce(
    columnFilters,
    options.debounceMs ?? 500
  );

  const applyFiltersToQuery = (query: any, filters: ColumnFiltersState) => {
    if (!filters.length) return query;

    filters.forEach((filter) => {
      const field = options.filterFields?.find((f) => f.id === filter.id);
      if (!field) return;

      // If field has options, treat as select/multi-select
      if (field.options) {
        if (Array.isArray(filter.value)) {
          query = query.in(filter.id, filter.value);
        } else {
          query = query.eq(filter.id, filter.value);
        }
      } else {
        // Default to text search for fields without options
        query = query.ilike(filter.id, `%${filter.value}%`);
      }
    });

    return query;
  };

  return {
    table,
    sorting,
    pagination,
    columnFilters: debouncedColumnFilters,
    selectColumnFilter,
    setSelectColumnFilter,
    applyFiltersToQuery,
  };
}
