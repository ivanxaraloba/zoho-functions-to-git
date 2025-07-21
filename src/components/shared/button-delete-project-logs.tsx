import React, { useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { Project } from '@/types/types';
import { useMutation } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '../ui/button';
import ButtonLoading from '../ui/button-loading';
import { DialogHeader } from '../ui/dialog';

export default function ButtonDeleteProjectLogs({
  username,
  onSuccess,
}: {
  username: Project['username'];
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);

  const mutationDeleteLogs = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('logs').delete().eq('projectUsername', username);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success('Project logs cleared successfully.');
      setOpen(false);
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message || 'Error updating function');
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Delete Logs
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <ButtonLoading
            variant="destructive"
            loading={mutationDeleteLogs.isPending}
            onClick={() => mutationDeleteLogs.mutate()}
          >
            Delete
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
