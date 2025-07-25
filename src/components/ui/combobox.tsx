'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const Combobox = React.forwardRef(function Combobox(
  {
    items = [],
    onChange,
    placeholder,
    value,
    size,
    variant,
    className,
  }: {
    items: any[];
    onChange: (value: any) => void;
    placeholder?: string;
    value: any;
    size?: string;
    variant?: string;
    className?: string;
  },
  ref: any,
) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          type="button"
          variant={variant as any}
          size={size as any}
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal active:scale-100',
            className,
          )}
        >
          {value ? (
            items.find(
              (item) => item.value === value || item.label === value,
            )?.label
          ) : (
            <span className="text-muted-foreground">
              {placeholder || 'Select item...'}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-30" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search item..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === item.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
