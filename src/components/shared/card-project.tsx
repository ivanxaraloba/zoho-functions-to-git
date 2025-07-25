import React from 'react';

import { cn } from '@/lib/utils';
import { IProjectWithRelations } from '@/types/fixed-types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import BadgeApplication from './badge-application';

export default function CardProject({ project, isActive }: { project: IProjectWithRelations; isActive: boolean }) {
  return (
    <div
      className={cn(
        'group relative flex max-h-28 cursor-pointer flex-row rounded-xl border p-5 px-0! text-left transition duration-150 ease-in-out hover:bg-primary-foreground',
        isActive && 'bg-primary-foreground border-muted-foreground/20',
      )}
    >
      <div className={cn('flex w-full flex-col justify-between gap-y-2 px-5')}>
        <div className="flex flex-col gap-0.5">
          <p className="shrink truncate pr-4 text-sm">{project.name}</p>
          <span className="text-muted-foreground text-sm">zoho.{project.domain}</span>
        </div>
        <div className="flex items-center gap-x-1.5">
          {!!project.crm && <BadgeApplication href={`/projects/${project.username}/crm`} application="crm" />}
          {!!project.creator?.creatorApps?.length && (
            <BadgeApplication href={`/projects/${project.username}/creator`} application="creator" />
          )}
          {!!project.recruit && (
            <BadgeApplication href={`/projects/${project.username}/recruit`} application="recruit" />
          )}
        </div>
      </div>
      <div className="text-foreground-lighter group-hover:text-foreground absolute top-4 right-4 transition-all duration-200 group-hover:right-2">
        <ChevronRight strokeWidth={1} className="size-4" />
      </div>
    </div>
  );
}
