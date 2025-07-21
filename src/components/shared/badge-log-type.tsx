import React from 'react';

import { Check } from 'lucide-react';

import { LOGS_TYPES_COLORS, LOGS_TYPES_ICONS, type LogType } from '@/utils/constants';

import { Badge } from '../ui/badge';

export default function BadgeLogType({ type }: { type: LogType }) {
  const Icon = LOGS_TYPES_ICONS[type];
  const color = LOGS_TYPES_COLORS[type];

  return (
    <Badge
      variant="outline"
      className="items-center gap-2 rounded-full"
      style={{ border: `1px solid rgba(${color}, 0.3)` }}
    >
      <Icon className="size-3" style={{ color: `rgb(${color})` }} />
      <span className="text-[10px]" style={{ color: `rgb(${color})` }}>
        {type}
      </span>
    </Badge>
  );
}
