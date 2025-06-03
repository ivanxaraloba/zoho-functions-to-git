import React, { useState } from 'react';

import { crmTestFunction } from '@/helpers/zoho/crm';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  Info,
  Parentheses,
  PlayCircleIcon,
  PlayIcon,
  StopCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  AppTabContent,
  AppTabContentBody,
  AppTabContentHead,
  AppTabDescription,
  AppTabHeader,
} from '@/components/layout/app-tab';
import CardContainer from '@/components/shared/card-container';
import ScriptViewer from '@/components/shared/script-viewer';
import { TypographyH2 } from '@/components/typography/typography-h2';
import { TypographyH3 } from '@/components/typography/typography-h3';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ButtonLoading from '@/components/ui/button-loading';
import { Card, CardHeader } from '@/components/ui/card';
import Description from '@/components/ui/description';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/stores/project';
import { sleep } from '@/utils/generic';

const formSchema = z.object({
  execTimes: z.coerce.number().min(1),
  code: z.string().min(3),
});

type ExecutionResult = {
  id: number | string;
  status: 'success' | 'error';
  message?: string;
  code?: string;
};

export default function TabBulkExecution() {
  const { project } = useProjectStore();
  const isPlayingRef = React.useRef(false);

  const [executionResults, setExecutionResults] = useState<
    ExecutionResult[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(formSchema),
    defaultValues: {
      execTimes: undefined,
      code: `string standalone.teste_iy1()
{
    pages = [0,1,2,3,4,5,6,7,8,9,10];
	contacts = zoho.crm.getRecords("Contacts", pages.get([index]), 200);
	updateList = list();
	for each contact in contacts
	{
		updateMap = map();
		updateMap.put("id", contact.getJSON("id"));
		updateMap.put("Skype_ID", "ola3");
		updateList.add(updateMap);
		if(updateList.size() == 100){
			info zoho.crm.bulkUpdate("Contacts", updateList);
			updateList = list();
		}
	}
	if(!updateList.isEmpty()){
		info zoho.crm.bulkUpdate("Contacts", updateList);
	}
	return "";
}`,
    },
  });

  const mutationExecution = useMutation({
    mutationFn: async ({
      code,
      execTimes,
    }: z.infer<typeof formSchema>) => {
      setExecutionResults([]);

      if (!project) throw new Error('Project data is unavailable.');
      const { data, error } = await crmTestFunction(
        project.domain,
        project.crm?.config,
        execTimes,
        code,
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const results: ExecutionResult[] = [];
      // @ts-ignore
      Object.keys(data).forEach((key) => {
        // @ts-ignore
        const request = data[key];
        if (request.error) {
          results.push({
            id: key,
            status: 'error',
            message: `${request.error.code}: ${request.error.message}`,
          });
        } else {
          const response = request.response.functions[0];
          results.push({
            id: key,
            status: 'success',
            message: 'Function executed successfully',
            code: request.codeFinal,
          });
        }
      });
      console.log({ results });
      setExecutionResults(results);
    },
    onError: (err) => {
      setExecutionResults([
        {
          id: 0,
          status: 'error',
          message: err.message || 'Error executing the function',
        },
      ]);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    mutationExecution.mutate(data);

  const handlePlayStop = async () => {
    console.log('click', isPlayingRef.current);

    if (isPlayingRef.current) {
      console.log('stopping execution');
      isPlayingRef.current = false;
      return;
    }

    // Start execution
    isPlayingRef.current = true;

    console.log('before', isPlayingRef.current);
    const values = form.getValues();

    do {
      console.log('running execution');
      await mutationExecution.mutateAsync(values);
      await sleep(2000);
    } while (isPlayingRef.current);
  };

  return (
    <>
      <AppTabHeader
        label="Function Execution"
        description={
          <Description>
            Use <code>[index]</code> in your code to reference the
            current execution number.
            <br />
            It will be dynamically replaced during each loop
            iteration. For example, if{' '}
            <strong>Number of Executions = 2</strong>:<br />– On the
            first run, <code>[index]</code> becomes <strong>1</strong>
            .<br />– On the second run, <code>
              [index]
            </code> becomes <strong>2</strong>.<br />
          </Description>
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AppTabContent>
            <FormField
              control={form.control}
              name="execTimes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AppTabContentHead>
                      <Input
                        placeholder="Number of executions"
                        type="number"
                        {...field}
                      />
                      <ButtonLoading
                        type="submit"
                        loading={mutationExecution.isPending}
                      >
                        Run
                      </ButtonLoading>
                      <Button
                        variant={
                          isPlayingRef.current
                            ? 'destructive'
                            : 'secondary'
                        }
                        type="button"
                        onClick={handlePlayStop}
                      >
                        {isPlayingRef.current ? (
                          <>
                            Stop
                            <StopCircle className="size-4" />
                          </>
                        ) : (
                          <>
                            Run
                            <PlayCircleIcon className="size-4" />
                          </>
                        )}
                      </Button>
                    </AppTabContentHead>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-x-10">
              <CardContainer
                className={cn(
                  executionResults.length > 0
                    ? 'col-span-1'
                    : 'col-span-2',
                )}
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ScriptViewer
                          {...field}
                          editable={!mutationExecution.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContainer>

              {executionResults.length > 0 && (
                <CardContainer>
                  <TypographyH3>Execution Logs</TypographyH3>
                  <div className="mt-4 space-y-2">
                    {executionResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2"
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            'pointer-events-none rounded-full text-white shadow-none',
                            result.status === 'error'
                              ? 'bg-red-400'
                              : 'bg-green-400',
                          )}
                        >
                          {result.status}
                        </Badge>

                        <div className="flex flex-col text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Execution {result.id}
                          </span>
                          <span>{result.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContainer>
              )}
            </div>
          </AppTabContent>
        </form>
      </Form>
    </>
  );
}
