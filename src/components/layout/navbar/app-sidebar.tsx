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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { project } = useProjectStore();
  const { user } = useGlobalStore();
  const pathname = usePathname();

  const fullName = user?.user_metadata.full_name ?? '';
  const email = user?.email ?? '';
  const avatar = fullName ? `${fullName[0]} ${fullName.split(' ')[1]?.[0] ?? ''}`.trim() : '';

  const data = {
    user: {
      name: fullName,
      email: email,
      avatar: avatar,
    },
    platform: [
      { title: 'Analytics', icon: ChartSpline, url: '/' },
      { title: 'Projects', icon: PanelsTopLeft, url: '/projects' },
      { title: 'Functions', icon: Parentheses, url: '/functions' },
      { title: 'Global Logs', icon: Logs, url: '/logs' },
    ].map((item) => ({
      ...item,
      isActive: item.url === '/' ? pathname === '/' : pathname.startsWith(item.url),
    })),
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
              <span className="truncate text-xs text-muted-foreground">v2.0</span>
            </div>
          </SidebarMenuButton>
        </Link>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Platform" items={data.platform} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
