import React from 'react';

import { Commit } from '@/types/types';
import { History, HistoryIcon, Meh } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '../ui/button';
import CardCommit from './card-commit';
import SectionMissing from './section-missing';

export default function ButtonCommitsHistory({ commits = [] }: { commits: Commit[] }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="sm">
          <History className="!size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Commits</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
