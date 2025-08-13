import { supabase } from '@/lib/supabase/client';
import { ProjectProvider } from '@/providers/project-provider';
import { notFound } from 'next/navigation';

import { ProjectSidebar } from '@/components/layout/navbar/project-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!project) return notFound();

  return (
    <SidebarProvider>
      <ProjectProvider project={project}>
        <ProjectSidebar />
        <SidebarInset>{children}</SidebarInset>
      </ProjectProvider>
    </SidebarProvider>
  );
}
