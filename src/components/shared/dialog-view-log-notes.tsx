import React, { useState } from 'react';

import { DialogProps } from '@radix-ui/react-dialog';
import { Row } from '@tanstack/react-table';
import { JsonViewer } from '@textea/json-viewer';
import { Eye } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type } from '@/utils/generic';

import { Button } from '../ui/button';

interface DialogViewLogNotesProps {
  rowAction: {
    row: Row<LogTable>;
    action: 'view' | 'create';
  } | null;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogViewLogNotes({ rowAction, open, onOpenChange }: DialogViewLogNotesProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-96 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rowAction?.row.original.function}</DialogTitle>
        </DialogHeader>
        <div className="h-96 max-h-96 overflow-auto whitespace-pre-wrap">
          {rowAction?.row.original.notes && type.isJson(rowAction.row.original.notes) ? (
            <JsonViewer
              value={JSON.parse(rowAction.row.original.notes)}
              theme="dark"
              displayDataTypes={false}
              rootName={false}
              collapseStringsAfterLength={20}
            />
          ) : (
            rowAction?.row.original.notes
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
