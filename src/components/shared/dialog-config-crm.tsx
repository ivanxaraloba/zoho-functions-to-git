'use client';

import React, { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { crmGetFunctions } from '@/lib/zoho/crm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Settings, Settings2Icon } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useProjectStore } from '@/stores/project';
import { BUCKETS } from '@/utils/constants';
import { str } from '@/utils/generic';

import { Button } from '../ui/button';
import ButtonLoading from '../ui/button-loading';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  curl: z.string().min(3),
});

export default function DialogConfigCRM() {
  const { project, getProject } = useProjectStore();

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      curl: '',
    },
  });

  const mutationCreateProject = useMutation({
    mutationFn: async ({ curl }: { curl: string }) => {
      const config = str.parseCURL(curl);
      console.log({ config });

      const { error: errorApiTest } = await crmGetFunctions(project?.domain, config, {
        limit: 1,
      });
      if (errorApiTest) throw errorApiTest;

      const { error: errorUpsert } = await supabase.from('crm').upsert({
        id: project?.crm?.id,
        projectId: project?.id,
        config,
      });
      if (errorUpsert) throw errorUpsert;
    },
    onSuccess: async () => {
      // @ts-ignore
      getProject(project?.username);
      toast.success('Settings updated successfully!');
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: any) => {
    mutationCreateProject.mutate(data);
  };

  useEffect(() => {
    // @ts-ignore
    form.reset({ ...project });
  }, [project?.id]);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          form.setValue('curl', '');
          setIsOpen(!isOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="secondary">
            Config
            <Settings2Icon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Config</DialogTitle>
            <DialogDescription>
              Paste the cURL request to configure the integration.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="curl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>cURL</FormLabel>
                    <FormControl>
                      <>
                        <Textarea
                          {...field}
                          className="textarea h-40 resize-none"
                          placeholder="Paste your cURL here..."
                        />
                        <Dialog>
                          <DialogTrigger className="w-fit">
                            <FormDescription>
                              Need help getting the cURL?{' '}
                              <span className="underline underline-offset-2">
                                Click here
                              </span>
                            </FormDescription>
                          </DialogTrigger>
                          <DialogContent className="w-7/12! max-w-full! border-none!">
                            <DialogTitle>Follow these steps to copy cURL</DialogTitle>
                            <ol className="list-decimal space-y-1 pl-5 text-xs">
                              <li>
                                Open the browser’s <strong>Inspector</strong> and go to
                                the <strong>Network</strong> tab.
                              </li>
                              <li>
                                Right-click a request that fetches app data (look for one
                                with cookies).
                              </li>
                              <li>
                                Select <strong>Copy</strong> <strong>Copy as cURL</strong>{' '}
                                (on Mac) or <strong>Copy as cURL (bash)</strong> (on
                                Windows).
                              </li>
                            </ol>
                            <Image
                              alt="crm_settings_image"
                              src={`${BUCKETS.SETTINGS}/settings_crm.png`}
                              className="w-full"
                              width={1000}
                              height={500}
                            />
                          </DialogContent>
                        </Dialog>
                      </>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter cancelBtn>
                <ButtonLoading type="submit" loading={mutationCreateProject.isPending}>
                  Save
                </ButtonLoading>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
