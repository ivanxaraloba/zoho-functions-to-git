'use client';

import React from 'react';

import { supabase } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, GitCommitIcon, Logs, Users } from 'lucide-react';

import MainContainer from '@/components/layout/main-container';
import CardStatistics from '@/components/shared/card-statistics';
import LogoCreator from '@/assets/img/logo-creator';
import LogoCrm from '@/assets/img/logo-crm';
import LogoRecruit from '@/assets/img/logo-recruit';

import { ChartErrorsByProject } from './_components/chart-errors-by-project';

const cardGroups = {
  top: [
    {
      table: 'projects' as keyof Tables,
      label: 'All Projects',
      icon: BarChart3,
    },
    {
      table: 'users' as keyof Tables,
      label: 'Team Members',
      icon: Users,
    },
    {
      table: 'commits' as keyof Tables,
      label: 'Code Commits',
      icon: GitCommitIcon,
    },
    {
      table: 'logs' as keyof Tables,
      label: 'Total Logs',
      icon: Logs,
    },
  ],
  bottom: [
    {
      table: 'crm' as keyof Tables,
      label: 'CRM Projects',
      icon: LogoCrm,
    },
    {
      table: 'creator' as keyof Tables,
      label: 'Creator Projects',
      icon: LogoCreator,
    },
    {
      table: 'recruit' as keyof Tables,
      label: 'Recruit Projects',
      icon: LogoRecruit,
    },
  ],
};

const allCards = [...cardGroups.top, ...cardGroups.bottom];

export default function Page() {
  const queryStats = useQuery({
    queryKey: ['global_stats'],
    queryFn: async () => {
      const results = await Promise.all(
        allCards.map(({ table }) =>
          supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
            .then(({ count }) => count || 0),
        ),
      );

      return allCards.reduce<Record<string, number>>((acc, card, index) => {
        acc[card.label] = results[index];
        return acc;
      }, {});
    },
  });

  return (
    <MainContainer breadcrumbs={[{ label: 'Analytics' }]}>
      <div className="space-y-4">
        {/* Top Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cardGroups.top.map((card) => (
            <CardStatistics
              key={card.label}
              label={card.label}
              value={queryStats.data?.[card.label]}
              icon={card.icon}
              isLoading={queryStats.isPending}
            />
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          {cardGroups.bottom.map((card) => (
            <CardStatistics
              key={card.label}
              label={card.label}
              value={queryStats.data?.[card.label]}
              icon={card.icon}
              isLoading={queryStats.isPending}
            />
          ))}
        </div>

        <ChartErrorsByProject />
      </div>
    </MainContainer>
  );
}
