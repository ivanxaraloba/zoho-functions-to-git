'use client';

import * as React from 'react';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { parseAsArrayOf, parseAsInteger, parseAsString, ParserBuilder, useQueryState, useQueryStates } from 'nuqs';
import { createSearchParamsCache, parseAsStringEnum } from 'nuqs/server';

import { DataTableFilterField } from '@/components/data-table/data-table-faceted-filter';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { getFiltersStateParser, getSortingStateParser } from '@/utils/parsers';
import { getValidFilters } from '@/utils/query';

export interface ColumnSort {
  desc: boolean;
  id: string;
}

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: StringKeyOf<TData>;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type SearchParamsConfig<TData> = {
  [K in StringKeyOf<TData>]?: ParserBuilder<unknown>;
};

export type ParsedSearchParams<T extends SearchParamsConfig<any>> = {
  page: number;
  perPage: number;
  sort: Array<{ id: string; desc: boolean }>;
  filters: Array<{ id: string; value: string | string[] }>;
  joinOperator: 'and' | 'or';
} & {
  [K in keyof T]: T[K] extends ParserBuilder<infer U> ? U : never;
};

interface UseDataTableProps<TData>
  extends Omit<
    TableOptions<TData>,
    'state' | 'pageCount' | 'getCoreRowModel' | 'manualFiltering' | 'manualPagination' | 'manualSorting'
  >,
  Required<Pick<TableOptions<TData>, 'pageCount'>> {
  pageCount: number;
  filterFields?: DataTableFilterField<TData>[];
  debounceMs?: number;
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedSortingState<TData>;
    perPage?: number;
  };
  columnsSearchParams?: SearchParamsConfig<TData>;
}

export function useDataTable<TData>({
  pageCount = -1,
  filterFields = [],
  debounceMs = 300,
  initialState,
  columnsSearchParams = {},
  ...props
}: UseDataTableProps<TData>) {
  const searchParamsCache = createSearchParamsCache({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(initialState?.perPage || 10),
    sort: getSortingStateParser<any>().withDefault(initialState?.sorting || [{ id: "created_at", desc: false }]),
    // advanced filter
    filters: getFiltersStateParser().withDefault([]),
    joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
    // columns
    ...columnsSearchParams,
  });

  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const search = searchParamsCache.parse(searchParamsObj);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(initialState?.rowSelection ?? {});

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(initialState?.pagination?.pageSize ?? 10),
  );

  const [sorting, setSorting] = useQueryState(
    'sort',
    getSortingStateParser<TData>().withDefault(initialState?.sorting ?? []),
  );

  const filterParsers = React.useMemo(() => {
    return filterFields.reduce<Record<string, ParserBuilder<string | string[]>>>((acc, field) => {
      acc[field.id] = field.options
        ? (parseAsArrayOf(parseAsString, ',') as ParserBuilder<string | string[]>)
        : (parseAsString as ParserBuilder<string | string[]>);
      return acc;
    }, {});
  }, [filterFields]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  const debouncedSetFilterValues = useDebouncedCallback(setFilterValues, debounceMs);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    Object.entries(filterValues).reduce<ColumnFiltersState>((acc, [key, val]) => {
      if (val !== null) {
        acc.push({ id: key, value: Array.isArray(val) ? val : [val] });
      }
      return acc;
    }, []),
  );

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: perPage,
  };

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    void setPage(next.pageIndex + 1);
    void setPerPage(next.pageSize);
  };

  const onSortingChange = (updater: Updater<SortingState>) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    void setSorting(next as ExtendedSortingState<TData>);
  };

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    console.log("dasjdsak");

    setColumnFilters((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;

      const updates = next.reduce<Record<string, string | string[] | null>>((acc, filter) => {
        if (
          filter.value &&
          ((Array.isArray(filter.value) && filter.value.length > 0) ||
            (typeof filter.value === 'string' && filter.value.trim() !== ''))
        ) {
          acc[filter.id] = filter.value;
        } else {
          acc[filter.id] = null;
        }
        return acc;
      }, {});

      prev.forEach((f) => {
        if (!next.some((n) => n.id === f.id)) {
          updates[f.id] = null;
        }
      });

      void setPage(1);
      debouncedSetFilterValues(updates);
      return next;
    });
  };

  const table = useReactTable({
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: false,
    ...props,
  });

  return {
    table,
    search,
  };
}
