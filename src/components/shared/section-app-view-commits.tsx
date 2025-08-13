import React from 'react';

import { supabase } from '@/lib/supabase/client';
import { queryClient } from '@/providers/react-query-provider';
import { IFunctionCrm } from '@/types/fixed-types';
import { Commit } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Check, Circle, CircleFadingArrowUp, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useGlobalStore } from '@/stores/global';
import { time } from '@/utils/generic';

import { Button } from '../ui/button';
import ButtonLoading from '../ui/button-loading';
import { Input } from '../ui/input';
import CardContainer from './card-container';

interface SectionAppViewCommitsProps {
  fn: IFunctionCrm;
  project: ProjectTable;
  path: string;
  setShowCommits: (show: boolean) => void;
  setActiveCommitId: (id: string | null) => void;
  activeCommitId: string | null;
  commits: Commit[];
  onSuccess: () => void;
}

const formSchema = z.object({
  message: z.string().min(4),
});

export default function SectionAppViewCommits({
  fn,
  path,
  project,
  setShowCommits,
  setActiveCommitId,
  activeCommitId,
  commits,
  onSuccess,
}: SectionAppViewCommitsProps) {
  const { user } = useGlobalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const mutationCommit = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const { data, error } = await supabase.from('commits').insert({
        userId: user?.profile?.id,
        projectId: project?.id,
        function: fn,
        message,
        functionId: fn.id,
        functionName: fn.name,
        path,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      onSuccess();
      toast.success('Commit created successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error committing');
    },
  });

  const onSubmit = (data: { message: string }) => {
    mutationCommit.mutate(data);
  };

  return (
    <CardContainer className="pt-0">
      <div className="bg-card sticky top-0 z-10 flex h-[69px] w-full items-center border-b">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Commits</span>
          <span className="text-muted-foreground text-xs font-medium">
            Browse versions and create a new commit
          </span>
        </div>
        <div className="ml-auto">
          <Button
            onClick={() => setShowCommits(false)}
            variant="ghost"
            size="icon"
            className="!size-8"
          >
            <X className="!size-3.5" />
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <Input
                      placeholder="Commit message (e.g., feat: add feature)"
                      {...field}
                    />
                  </FormControl>
                  <ButtonLoading
                    size="sm"
                    type="submit"
                    loading={mutationCommit.isPending}
                  >
                    Commit
                  </ButtonLoading>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex flex-col gap-1">
          <Button
            onClick={() => {
              setActiveCommitId(null);
            }}
            variant={activeCommitId === null ? 'secondary' : 'ghost'}
            className="mt-4 h-full justify-start"
          >
            <div className="mr-2">
              <Circle className="!size-3.5 text-gray-400" />
            </div>
            <div className="flex flex-col items-start">
              <span className="truncate text-sm font-medium">Current Version</span>
              <span className="text-muted-foreground truncate text-xs font-normal">
                Last synced version
              </span>
            </div>
          </Button>
          {commits.map((commit: Commit) => (
            <Button
              key={commit.id}
              onClick={() => {
                setActiveCommitId(String(commit.id));
              }}
              variant={activeCommitId === String(commit.id) ? 'secondary' : 'ghost'}
              className="h-full justify-start px-3 py-1.5"
            >
              <div className="mr-2">
                {commit.status === 'committed' ? (
                  <Check className="!size-3.5 text-green-400" />
                ) : (
                  <CircleFadingArrowUp className="!size-3.5 text-amber-500" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="truncate text-sm font-medium">{commit.message}</span>
                <span className="text-muted-foreground truncate text-xs font-normal">
                  {commit.users.bbUsername}, {time.friendlyTime(commit.created_at)}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </CardContainer>
  );
}
