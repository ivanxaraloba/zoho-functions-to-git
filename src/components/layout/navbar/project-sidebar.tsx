'use client';

import * as React from 'react';

import { useProject } from '@/providers/project-provider';
import { Logs, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NavMain } from '@/components/layout/navbar/nav-main';
import { NavUser } from '@/components/layout/navbar/nav-user';
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

export function ProjectSidebar({ ...props }: {} & React.ComponentProps<typeof Sidebar>) {
  const project = useProject();
  const { username } = project;
  const { user } = useGlobalStore();
  const pathname = usePathname();

  const fullName = user?.user_metadata.full_name ?? '';
  const email = user?.email ?? '';
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0])
    .join(' ')
    .trim();

  const createNavItems = (
    items: { title: string; icon: any; url: string }[],
    exactMatch?: boolean,
  ) =>
    items.map((item) => ({
      ...item,
      isActive: exactMatch ? pathname === item.url : pathname.startsWith(item.url),
    }));

  const projectItems = createNavItems(
    [
      { title: 'Details', icon: ReceiptText, url: `/projects/${username}` },
      { title: 'Logs', icon: Logs, url: `/projects/${username}/logs` },
    ],
    true,
  );

  const project2Items = createNavItems([
    { title: 'Zoho CRM', icon: LogoCrm, url: `/projects/${username}/crm` },
    { title: 'Zoho Creator', icon: LogoCreator, url: `/projects/${username}/creator` },
    { title: 'Zoho Recruit', icon: LogoRecruit, url: `/projects/${username}/recruit` },
  ]);

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
      </SidebarHeader>

      <SidebarContent>
        <NavMain label="Project" items={projectItems} />
        <NavMain label="Integrations" items={project2Items} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: fullName,
            email,
            avatar: initials,
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
