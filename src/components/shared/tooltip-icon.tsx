import React from 'react';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function TooltipIcon({ icon: Icon, text, className }: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Icon className={cn('!size-3', className)} />
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
