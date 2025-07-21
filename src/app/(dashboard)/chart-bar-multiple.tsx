'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const COLORS = [
  '#FFE4E1',
  '#FF8C8C',
  '#DC143C',
  '#B22222',
  '#FF0000',
  '#8B0000',
  '#CD5C5C',
  '#A52A2A',
  '#800000',
  '#FF6B6B',
];

const DAYS = 15;

export function ChartBarMultiple() {
  const router = useRouter();
  const [chartData, setChartData] = useState<any[]>([]);
  const [projects, setProjects] = useState<
    { username: string; name: string }[]
  >([]);

  useEffect(() => {
    const loadData = async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - DAYS);

      const { data, error } = await supabase
        .from('logs')
        .select('created_at, projectUsername, projects(name)')
        .eq('type', 'error')
        .gte('created_at', startDate.toISOString());

      if (error || !data) return;

      const grouped: Record<string, Record<string, number>> = {};
      const projectMap = new Map<string, string>();

      data.forEach(({ created_at, projectUsername, projects }) => {
        const date = created_at.split('T')[0];
        const username = projectUsername ?? 'unknown username';
        const name = projects?.name || 'unknown name';

        if (!grouped[date]) grouped[date] = {};
        grouped[date][username] = (grouped[date][username] || 0) + 1;
        projectMap.set(username, name);
      });

      setChartData(
        Object.entries(grouped).map(([date, counts]) => ({
          date,
          ...counts,
        })),
      );

      setProjects(
        Array.from(projectMap, ([username, name]) => ({
          username,
          name,
        })),
      );
    };

    loadData();
  }, []);

  const totalErrors = chartData.reduce(
    (sum, row) =>
      sum +
      Object.entries(row).reduce(
        (s, [key, val]) => (key !== 'date' ? s + (val as number) : s),
        0,
      ),
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Errors by Project (Last {DAYS} Days)</CardTitle>
        <CardDescription>
          {totalErrors} errors recorded.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={Object.fromEntries(
            projects.map((p, i) => [
              p.username,
              { label: p.name, color: COLORS[i % COLORS.length] },
            ]),
          )}
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(v) => v.slice(5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {projects.map((p, i) => (
              <Bar
                className="cursor-pointer"
                key={p.username}
                dataKey={p.username}
                name={p.name}
                fill={COLORS[i % COLORS.length]}
                radius={4}
                onClick={() => {
                  router.push(`/projects/${p.username}/logs`);
                }}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
        <CardFooter className="text-muted-foreground mt-4 flex flex-col justify-center pb-0 text-xs">
          <div>
            {projects.length} project{projects.length !== 1 && 's'}{' '}
            with error logs in the last {DAYS} days.
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
