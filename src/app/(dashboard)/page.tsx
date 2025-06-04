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
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { TypographyH1 } from '@/components/typography/typography-h1';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import LogoCreator from '@/assets/img/logo-creator';
import LogoCrm from '@/assets/img/logo-crm';
import LogoRecruit from '@/assets/img/logo-recruit';

import { ChartBarMultiple } from './chart-bar-multiple';

const cardGroups = {
  top: [
    {
      table: 'projects' as keyof Tables,
      title: 'All Projects',
      icon: BarChart3,
    },
    {
      table: 'users' as keyof Tables,
      title: 'Team Members',
      icon: Users,
    },
    {
      table: 'commits' as keyof Tables,
      title: 'Code Commits',
      icon: GitCommitIcon,
    },
    {
      table: 'logs' as keyof Tables,
      title: 'Total Logs',
      icon: Logs,
    },
  ],
  bottom: [
    {
      table: 'crm' as keyof Tables,
      title: 'CRM Projects',
      icon: LogoCrm,
    },
    {
      table: 'creator' as keyof Tables,
      title: 'Creator Projects',
      icon: LogoCreator,
    },
    {
      table: 'recruit' as keyof Tables,
      title: 'Recruit Projects',
      icon: LogoRecruit,
    },
  ],
};

const allCards = [...cardGroups.top, ...cardGroups.bottom];

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

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  return (
    <div>
      <div className="flex items-center gap-4 pb-10 text-xs">
        <TypographyH1>Dashboard</TypographyH1>
      </div>

      <div className="space-y-4">
        {/* Top Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderCards(data.slice(0, cardGroups.top.length))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          {renderCards(data.slice(cardGroups.top.length))}
        </div>

        <ChartBarMultiple />
      </div>
    </div>
  );
}
