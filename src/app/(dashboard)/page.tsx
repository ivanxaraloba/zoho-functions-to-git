'use client';

import React from 'react';

import { supabase } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  FileCode,
  GitBranch,
  GitCommitIcon,
  Logs,
  Users,
} from 'lucide-react';

import { TypographyH1 } from '@/components/typography/typography-h1';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LogoCreator from '@/assets/img/logo-creator';
import LogoCrm from '@/assets/img/logo-crm';
import LogoRecruit from '@/assets/img/logo-recruit';

const cardGroups = {
  top: [
    { table: 'projects', title: 'All Projects', icon: BarChart3 },
    { table: 'users', title: 'Team Members', icon: Users },
    { table: 'commits', title: 'Code Commits', icon: GitCommitIcon },
    { table: 'logs', title: 'Total Logs', icon: Logs },
  ],
  bottom: [
    {
      table: 'crm',
      title: 'Projects using CRM',
      icon: LogoCrm,
    },
    {
      table: 'creator',
      title: 'Projects using Creator',
      icon: LogoCreator,
    },
    {
      table: 'recruit',
      title: 'Projects using Recruitment',
      icon: LogoRecruit,
    },
  ],
};

const allCards = [...cardGroups.top, ...cardGroups.bottom];

export default function Page() {
  const { data = [] } = useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const results = await Promise.all(
        allCards.map(({ table }) =>
          supabase
            .from(table)
            .select('*', { count: 'exact', head: true }),
        ),
      );

      return allCards.map((card, i) => ({
        ...card,
        value: results[i].count ?? 0,
      }));
    },
  });

  type CardWithValue = (typeof allCards)[number] & { value: number };

  const renderCards = (cards: CardWithValue[]) => {
    return cards.map((card) => {
      const CardIcon = card.icon;
      return (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <CardIcon size={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div>
      <div className="flex items-center gap-4 pb-10 text-xs">
        <TypographyH1>Projects</TypographyH1>
      </div>

      <div className="space-y-4">
        {/* Top Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderCards(data.slice(0, cardGroups.top.length))}
        </div>

        {/* Bottom Row */}
        <div className="grid gap-4">
          {renderCards(data.slice(cardGroups.top.length))}
        </div>
      </div>
    </div>
  );
}
