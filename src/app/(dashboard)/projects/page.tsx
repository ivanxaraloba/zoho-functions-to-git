'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { IProjectWithRelations } from '@/types/fixed-types';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import MainContainer from '@/components/layout/main-container';
import CardProject from '@/components/shared/card-project';
import { Input } from '@/components/ui/input';

export default function Page() {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const queryProjects = useQuery<IProjectWithRelations[]>({
    queryKey: ['projects_all_information'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, departments(*), crm(id), creator(id, creatorApps(id)), recruit(id)');
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const columns: ColumnDef<IProjectWithRelations>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
  ];

  const table = useReactTable({
    data: queryProjects.data ?? [],
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  });

  const rows = table.getRowModel().rows;

  useEffect(() => {
    if (rows.length > 0) {
      setActiveIndex(0);
    } else {
      setActiveIndex(-1);
    }
  }, [rows.length]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i < rows.length - 1 ? i + 1 : i));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : i));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < rows.length) {
        const selectedProject = rows[activeIndex].original;
        router.push(`/projects/${selectedProject.username}`);
      }
    }
  }

  return (
    <MainContainer breadcrumbs={[{ label: 'Projects' }]}>
      <div className="flex items-center gap-3">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search projects..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full rounded border p-2"
            autoFocus
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {rows.map((row, idx) => (
          <Link
            prefetch={false}
            href={`/projects/${row.original.username}`}
            key={row.original.id}
            onClick={() => setActiveIndex(idx)}
          >
            <CardProject project={row.original} isActive={idx === activeIndex} />
          </Link>
        ))}
      </div>
    </MainContainer>
  );
}
