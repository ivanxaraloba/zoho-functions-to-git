'use client';

import * as React from 'react';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartSpline,
  Command,
  Eye,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Logs,
  Map,
  PanelsTopLeft,
  Parentheses,
  PieChart,
  ReceiptText,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavMain } from '@/components/layout/navbar/nav-main';
import { NavProjects } from '@/components/layout/navbar/nav-projects';
import { NavUser } from '@/components/layout/navbar/nav-user';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useGlobalStore } from '@/stores/global';
import { useProjectStore } from '@/stores/project';
import LogoCreator from '@/assets/img/logo-creator';
import LogoCrm from '@/assets/img/logo-crm';
import LogoLoba from '@/assets/img/logo-loba';
import LogoRecruit from '@/assets/img/logo-recruit';

export function ProjectSidebar({ username, ...props }: { username: string } & React.ComponentProps<typeof Sidebar>) {
  const { project } = useProjectStore();
  const { user } = useGlobalStore();

  const fullName = user?.user_metadata.full_name ?? '';
  const email = user?.email ?? '';
  const avatar = fullName ? `${fullName[0]} ${fullName.split(' ')[1]?.[0] ?? ''}`.trim() : '';

  const pathname = usePathname();

  function isActivePath(pathname: string, url: string, exact = false) {
    if (exact) return pathname === url;
    return pathname.startsWith(url);
  }

  const projectItems = [
    {
      title: 'Details',
      icon: ReceiptText,
      url: `/projects/${username}`,
    },
    {
      title: 'Logs',
      icon: Logs,
      url: `/projects/${username}/logs`,
    },
  ].map((item) => ({
    ...item,
    isActive: item.title === 'Details' ? pathname === item.url : pathname.startsWith(item.url),
  }));

  const project2Items = [
    {
      title: 'Zoho CRM',
      icon: LogoCrm,
      url: `/projects/${username}/crm`,
    },
    {
      title: 'Zoho Creator',
      icon: LogoCreator,
      url: `/projects/${username}/creator`,
    },
    {
      title: 'Zoho Recruit',
      icon: LogoRecruit,
      url: `/projects/${username}/recruit`,
    },
  ].map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  const data = {
    user: {
      name: fullName,
      email: email,
      avatar: avatar,
    },
    project: projectItems,
    project2: project2Items,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <LogoLoba />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">loba z2g</span>
              <span className="text-muted-foreground truncate text-xs">v2.0</span>
            </div>
          </SidebarMenuButton>
        </Link>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Project" items={data.project} />
        <NavMain label="Integrations" items={data.project2} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
