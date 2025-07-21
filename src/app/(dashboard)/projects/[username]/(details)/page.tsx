'use client';

import { useEffect, useState } from 'react';

import { getRepository, updateRepository } from '@/lib/bitbucket';
import { supabase } from '@/lib/supabase/client';
import { queryClient } from '@/providers/react-query-provider';
import { Project } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Ban,
  Check,
  EditIcon,
  FileText,
  Globe,
  Logs,
  Parentheses,
  Settings,
  SquareArrowOutUpRight,
  Trash,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import MainContainer from '@/components/layout/main-container';
import { ButtonNavTabs } from '@/components/layout/nav-tabs';
import CardContainer from '@/components/shared/card-container';
import CardStatistics from '@/components/shared/card-statistics';
import DialogConfirmation from '@/components/shared/dialog-confirmation';
import LoadingScreen from '@/components/shared/loading-screen';
import { TypographyH1 } from '@/components/typography/typography-h1';
import { TypographyH2 } from '@/components/typography/typography-h2';
import { TypographyH3 } from '@/components/typography/typography-h3';
import { Button } from '@/components/ui/button';
import ButtonLoading from '@/components/ui/button-loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import Description from '@/components/ui/description';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGlobalStore } from '@/stores/global';
import { useProjectStore } from '@/stores/project';
import { getRepositoryName, str } from '@/utils/generic';
import LogoRecruit from '@/assets/img/logo-recruit';

const formSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  domain: z.string().min(1),
  departmentId: z.number(),
});

export default function Page({ params: { username } }: { params: { username: string } }) {
  const router = useRouter();
  const { project, getProject } = useProjectStore();
  const { departments } = useGlobalStore();

  const queryStats = useQuery({
    queryKey: ['project_stats', username],
    queryFn: async () => {
      const [totalLogs, errorLogs, successLogs] = await Promise.all([
        supabase.from('logs').select('*', { count: 'exact', head: true }).eq('projectUsername', username),

        supabase
          .from('logs')
          .select('*', { count: 'exact', head: true })
          .eq('projectUsername', username)
          .eq('type', 'error'),

        supabase
          .from('logs')
          .select('*', { count: 'exact', head: true })
          .eq('projectUsername', username)
          .eq('type', 'success'),
      ]);

      return {
        logsCount: totalLogs.count,
        errorCount: errorLogs.count,
        successCount: successLogs.count,
      };
    },
    enabled: !!username,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const mutationDeleteProject = useMutation({
    mutationFn: async () => {
      if (!project) throw new Error('Project data is not available');

      const { error } = await supabase.from('projects').delete().eq('id', project.id);
      if (error) throw error;
    },
    onSuccess: () => {
      router.push('/');
      toast.success('Project deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Error');
    },
  });

  const mutationUpdateProject = useMutation({
    mutationFn: async (data: Project) => {
      if (!project) throw new Error('Project data is not available');

      if (data.username !== project?.username || data.domain !== project?.domain) {
        const { data: repository } = await getRepository(getRepositoryName(project.domain, project.username));

        if (repository) {
          const { error } = await updateRepository(
            getRepositoryName(project.domain, project.username),
            getRepositoryName(data.domain, data.username),
          );
          if (error) throw new Error(error.message);
        }
      }

      const { error } = await supabase.from('projects').update(data).eq('id', project?.id);

      if (error) throw error;

      return data.username;
    },
    onSuccess: async (username: ProjectTable['username']) => {
      await getProject(username);
      const redirect = username !== project?.username;
      toast.success('Project updated successfully!');
      if (redirect) router.push(`/projects/${username}`);
    },
    onError: (err) => {
      toast.error(err.message || 'Error loading file');
    },
  });

  const onSubmit = (data: any) => {
    mutationUpdateProject.mutate(data);
  };

  useEffect(() => {
    if (!project) return;
    form.reset({
      name: project.name ?? '',
      username: project.username ?? '',
      domain: project.domain ?? '',
      departmentId: project.departmentId ?? undefined,
    });
  }, [username, project]);

  return (
    <MainContainer
      breadcrumbs={[
        {
          label: 'Projects',
          href: '/projects',
        },
        {
          label: project?.name || '',
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardStatistics
          label="Total Logs"
          value={queryStats.data?.logsCount}
          icon={Logs}
          isLoading={queryStats.isPending}
        />
        <CardStatistics
          label="Error Logs"
          value={queryStats.data?.errorCount}
          icon={Ban}
          isLoading={queryStats.isPending}
        />
        <CardStatistics
          label="Success Logs"
          value={queryStats.data?.successCount}
          icon={Check}
          isLoading={queryStats.isPending}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* basic information */}
          <CardContainer>
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-secondary">
                <FileText className="size-3" />
              </div>
              <TypographyH3>Basic Information</TypographyH3>
            </div>
            <div className="mt-4 space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Combobox
                        variant="outline"
                        items={departments.map((i) => ({
                          label: i.name,
                          value: i.id,
                        }))}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContainer>
          {/* username */}
          <CardContainer>
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-secondary">
                <Globe className="size-3" />
              </div>
              <div className="flex flex-col">
                <TypographyH3>Domain & URL</TypographyH3>
                <FormDescription>Modifying this data will apply the name change to the Git repository</FormDescription>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        onChange={(e: any) => field.onChange(str.slugify(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Combobox
                        variant="outline"
                        items={['eu', 'com'].map((i) => ({
                          label: i,
                          value: i,
                        }))}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Description className="mt-2">
              lobaz2g-
              <span className="text-primary">{form.watch('domain')}</span>-
              <span className="text-primary">{form.watch('username')}</span>
            </Description>
          </CardContainer>
          <div className="flex justify-end gap-2">
            <DialogConfirmation
              button={
                <Button variant="destructive" type="button">
                  Delete
                </Button>
              }
              action={() => mutationDeleteProject.mutate()}
            />

            <ButtonLoading type="submit" variant="default" loading={mutationUpdateProject.isPending}>
              Save Changes
            </ButtonLoading>
          </div>
        </form>
      </Form>
    </MainContainer>
  );
}
