import React from 'react';

import { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

type CardStatisticsProps = {
  label: string;
  value: React.ReactNode;
  icon: any;
  isLoading?: boolean;
};

export default function CardStatistics({
  label,
  value,
  icon: Icon,
  isLoading = false,
}: CardStatisticsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-[75%]" />
            <Skeleton className="size-6" />
          </>
        ) : (
          <>
            <CardTitle className="text-sm font-medium">
              {label}
            </CardTitle>
            <Icon size={16} />
          </>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-32" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
