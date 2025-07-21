import React from 'react';

import { cn } from '@/lib/utils';
import { Commit, Project } from '@/types/types';
import { format } from 'date-fns';
import { CheckCircle, CircleCheck, CircleFadingArrowUp, Eye } from 'lucide-react';
import Link from 'next/link';

import { time } from '@/utils/generic';

import { Button } from '../ui/button';
import Description from '../ui/description';

export default function CardCommit({ commit, onClick }: { commit: Commit; onClick: any }) {
  return (
    <Button onClick={onClick} variant="ghost" className="h-full justify-start p-2">
      <div className="mr-2">
        {commit.status === 'pending' ? (
          <CircleFadingArrowUp className="!size-3.5 text-amber-500" />
        ) : commit.status === 'committed' ? (
          <CircleCheck className="!size-3.5 text-green-400" />
        ) : (
          <span>?</span>
        )}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">{commit.message}</span>
        <span className="text-xs font-normal">
          {commit.users.bbUsername}, {time.friendlyTime(commit.created_at)}
        </span>
      </div>
    </Button>
  );
}
