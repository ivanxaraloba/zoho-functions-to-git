'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Logs,
  PanelsTopLeft,
  Parentheses,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import Sidebar from '@/components/layout/sidebar';
import FormSetupBitbucket from '@/components/shared/form-setup-bitbucket';
import LoadingScreen from '@/components/shared/loading-screen';
import { useGlobalStore } from '@/stores/global';

import PageLogin from '../(auth)/login/page';

const routes = [
  { name: 'Analytics', icon: LayoutDashboard, to: '/' },
  { name: 'Projects', icon: PanelsTopLeft, to: '/projects' },
  { name: 'Functions', icon: Parentheses, to: '/functions' },
  { name: 'Logs', icon: Logs, to: '/logs' },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  let { user, getUser, getFunctions, getProjects, getDepartments } =
    useGlobalStore();

  const queryUser = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
  useQuery({ queryKey: ['functions'], queryFn: getFunctions });
  useQuery({ queryKey: ['projects'], queryFn: getProjects });
  useQuery({ queryKey: ['departments'], queryFn: getDepartments });

  if (queryUser.isLoading) return <LoadingScreen />;
  if (!user) return <PageLogin />;
  if (!user.profile) return <FormSetupBitbucket />;
  // if (pathname.includes('/projects/')) return <>{children}</>;

  return children;
}
