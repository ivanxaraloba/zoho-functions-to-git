import React from 'react';

import { cn } from '@/lib/utils';

export default function CardContainer({ children, className }: { children: any; className?: string }) {
  return <div className={cn('rounded-2xl border bg-card p-4', className)}>{children}</div>;
}
