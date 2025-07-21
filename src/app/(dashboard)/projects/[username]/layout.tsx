'use client';

import { supabase } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { ProjectSidebar } from '@/components/layout/navbar/project-sidebar';
import { useProjectStore } from '@/stores/project';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { username } = useParams<{ username: string }>();
  const { getProject } = useProjectStore();

  const queryProject = useQuery({
    queryKey: ['project_details', username],
    queryFn: async () => {
      const response = await getProject(username);
      return response;
    },
    enabled: !!username,
  });

  return (
    queryProject.isFetched && (
      <div>
        <ProjectSidebar username={username} />
        {children}
      </div>
    )
  );
}
