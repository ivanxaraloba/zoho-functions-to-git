'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Command, Moon, MoonIcon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import DialogSearch from '../shared/dialog-search';
import { Input } from '../ui/input';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MainContainerProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default function MainContainer({ children, breadcrumbs = [], className }: MainContainerProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex w-full items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <Link href={item.href || ''}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className={cn(index == breadcrumbs.length - 1 ? 'text-foreground' : 'text-muted-foreground')}
                      >
                        {item.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Link>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <DialogSearch>
              <div className="relative flex items-center">
                <Input placeholder="Search" className="pointer-events-none h-8 w-72" />
                <div className="absolute right-2 flex gap-0.5">
                  <div className="flex size-5 items-center justify-center rounded-md border">
                    <Command className="size-3" />
                  </div>
                  <div className="flex size-5 items-center justify-center rounded-md border">
                    <span className="text-xs font-[10px]">K</span>
                  </div>
                </div>
              </div>
            </DialogSearch>
            <Button
              className="size-8"
              variant="ghost"
              size="icon"
              onClick={() => (theme === 'light' ? setTheme('dark') : setTheme('light'))}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>
      <div className={cn('h-full w-full space-y-4 p-6', className)}>{children}</div>
    </div>
  );
}
