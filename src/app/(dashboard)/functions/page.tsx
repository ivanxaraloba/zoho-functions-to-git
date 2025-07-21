'use client';

import React, { useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { DataTableFilterField } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { parseAsStringEnum } from 'nuqs';
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger } from 'nuqs/server';
import { z } from 'zod';

import { DataTable } from '@/components/data-table/data-table';
import { RowAction, TableData } from '@/components/data-table/data-table-config';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import MainContainer from '@/components/layout/main-container';
import { SearchParamsConfig, useDataTable } from '@/hooks/use-data-table';
import { APPLICATIONS_TYPES } from '@/utils/constants';
import { getFiltersStateParser, getSortingStateParser } from '@/utils/parsers';
import { applyFiltersParamsToQuery } from '@/utils/query';

import { columns, columnsSearchParams, filterFields } from './columns';

export default function Page() {
  const [{ data, pageCount }, setData] = useState<TableData>({
    data: [],
    pageCount: 0,
  });

  const [rowAction, setRowAction] = useState<RowAction<FunctionTable> | null>(null);

  const { table, search } = useDataTable<FunctionTable>({
    data: data || [],
    pageCount,
    columns: columns(setRowAction),
    filterFields,
    columnsSearchParams,
  });

  const queryFunctions = useQuery({
    queryKey: ['functions', search],
    queryFn: async () => {
      let query = supabase.from('functions').select('id, name, applications, created_at', {
        count: 'exact',
      });

      if (Array.isArray(search.applications) && search.applications.length > 0) {
        query.contains('applications', search.applications);
      }
      if (search.name) {
        query.ilike('name', `%${search.name}%`);
      }

      const response = await applyFiltersParamsToQuery(query, search);

      setData({
        data: response.data,
        pageCount: Math.ceil(response.count / search.perPage),
      });
    },
  });

  return (
    <MainContainer breadcrumbs={[{ label: 'Functions' }]}>
      <DataTable
        table={table}
        loadingConfig={{
          isLoading: queryFunctions.isPending,
          layout: {
            columns: 5,
            columnWidths: ['300px', '400px', '200px', '200px', '50px'],
          },
        }}
      >
        <DataTableToolbar table={table} filterFields={filterFields} />
      </DataTable>
    </MainContainer>
  );
}
