import React from 'react';

import { dataTableConfig } from '@/config/data-table';
import { cn, formatDate } from '@/lib/utils';
import { DataTableAdvancedFilterField, Filter, FilterOperator, JoinOperator } from '@/types';
import { Table } from '@tanstack/react-table';
import { id } from 'date-fns/locale';
import { CalendarIcon, ChevronsUpDown, ListFilter, Trash2 } from 'lucide-react';
import { customAlphabet } from 'nanoid';
import { parseAsStringEnum, useQueryState } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { getFiltersStateParser } from '@/utils/parsers';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  FacetedFilter,
  FacetedFilterContent,
  FacetedFilterEmpty,
  FacetedFilterGroup,
  FacetedFilterInput,
  FacetedFilterItem,
  FacetedFilterList,
  FacetedFilterTrigger,
} from '../ui/faceted-filter';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { getFilterOperators } from './data-table-config';
import { StringKeyOf } from './data-table-faceted-filter';

export default function DataTableAdvancedFilter<TData>({
  table,
  debounceMs = 300,
  filterFields,
}: {
  table: Table<TData>;
  debounceMs?: number;
  filterFields: DataTableAdvancedFilterField<TData>[];
}) {
  const [filters, setFilters] = useQueryState(
    'filters',
    getFiltersStateParser(table.getRowModel().rows[0]?.original).withDefault([]).withOptions({
      clearOnDefault: true,
    }),
  );

  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs);

  const [joinOperator, setJoinOperator] = useQueryState(
    'joinOperator',
    parseAsStringEnum(['and', 'or']).withDefault('and').withOptions({
      clearOnDefault: true,
    }),
  );

  const getDefaultOperator = (filterField: DataTableAdvancedFilterField<TData>) => {
    return filterField.type === 'text' ? 'iLike' : 'eq';
  };

  function addFilter() {
    const filterField = filterFields[0];

    if (!filterField) return;

    void setFilters([
      ...filters,
      {
        id: filterField.id,
        value: '',
        type: filterField.type,
        operator: getDefaultOperator(filterField),
        rowId: customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)(),
      },
    ]);
  }

  function updateFilter({
    rowId,
    field,
    debounced = false,
  }: {
    rowId: string;
    field: Omit<Partial<Filter<TData>>, 'rowId'>;
    debounced?: boolean;
  }) {
    const updateFunction = debounced ? debouncedSetFilters : setFilters;
    updateFunction((prevFilters) => {
      const updatedFilters = prevFilters.map((filter) => {
        if (filter.rowId === rowId) {
          return { ...filter, ...field };
        }
        return filter;
      });
      return updatedFilters;
    });
  }

  function removeFilter(rowId: string) {
    const updatedFilters = filters.filter((filter) => filter.rowId !== rowId);
    void setFilters(updatedFilters);
  }

  function renderFilterInput({ filter, inputId }: { filter: Filter<TData>; inputId: string }) {
    const filterField = filterFields.find((f) => f.id === filter.id);

    if (!filterField) return null;

    if (filter.operator === 'isEmpty' || filter.operator === 'isNotEmpty') {
      return (
        <div
          id={inputId}
          role="status"
          aria-live="polite"
          aria-label={`${filterField.label} filter is ${filter.operator === 'isEmpty' ? 'empty' : 'not empty'}`}
          className="h-8 w-full rounded border border-dashed"
        />
      );
    }

    switch (filter.type) {
      case 'text':
      case 'number':
        return (
          <Input
            id={inputId}
            type={filter.type}
            aria-label={`${filterField.label} filter value`}
            aria-describedby={`${inputId}-description`}
            placeholder={filterField.placeholder ?? 'Enter a value...'}
            className="h-8 w-full rounded"
            defaultValue={typeof filter.value === 'string' ? filter.value : undefined}
            onChange={(event) =>
              updateFilter({
                rowId: filter.rowId,
                field: { value: event.target.value },
                debounced: true,
              })
            }
          />
        );
      case 'select':
        return (
          <FacetedFilter>
            <FacetedFilterTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} filter value`}
                aria-controls={`${inputId}-listbox`}
                className="text-muted-foreground hover:text-muted-foreground h-8 w-full justify-start gap-2 rounded px-1.5 text-left"
              >
                {filter.value && typeof filter.value === 'string' ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {filterField?.options?.find((option) => option.value === filter.value)?.label || filter.value}
                  </Badge>
                ) : (
                  <>
                    {filterField.placeholder ?? 'Select an option...'}
                    <ChevronsUpDown className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </FacetedFilterTrigger>
            <FacetedFilterContent
              id={`${inputId}-listbox`}
              className="w-50 origin-(--radix-popover-content-transform-origin)"
            >
              <FacetedFilterInput
                placeholder={filterField?.label ?? 'Search options...'}
                aria-label={`Search ${filterField?.label} options`}
              />
              <FacetedFilterList>
                <FacetedFilterEmpty>No options found.</FacetedFilterEmpty>
                <FacetedFilterGroup>
                  {filterField?.options?.map((option) => (
                    <FacetedFilterItem
                      key={option.value}
                      value={option.value}
                      selected={filter.value === option.value}
                      onSelect={(value) => {
                        updateFilter({
                          rowId: filter.rowId,
                          field: { value },
                        });
                        setTimeout(() => {
                          document.getElementById(inputId)?.click();
                        }, 0);
                      }}
                    >
                      {option.icon && <option.icon className="text-muted-foreground mr-2 size-4" aria-hidden="true" />}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </FacetedFilterItem>
                  ))}
                </FacetedFilterGroup>
              </FacetedFilterList>
            </FacetedFilterContent>
          </FacetedFilter>
        );
      case 'multi-select':
        const selectedValues = new Set(Array.isArray(filter.value) ? filter.value : []);

        return (
          <FacetedFilter>
            <FacetedFilterTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} filter values`}
                aria-controls={`${inputId}-listbox`}
                className="text-muted-foreground hover:text-muted-foreground h-8 w-full justify-start gap-2 rounded px-1.5 text-left"
              >
                <>
                  {selectedValues.size === 0 && (
                    <>
                      {filterField.placeholder ?? ' Select options...'}
                      <ChevronsUpDown className="size-4" aria-hidden="true" />
                    </>
                  )}
                </>
                {selectedValues?.size > 0 && (
                  <div className="flex items-center">
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                      {selectedValues.size}
                    </Badge>
                    <div className="hidden min-w-0 gap-1 lg:flex">
                      {selectedValues.size > 2 ? (
                        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                          {selectedValues.size} selected
                        </Badge>
                      ) : (
                        filterField?.options
                          ?.filter((option) => selectedValues.has(option.value))
                          .map((option) => (
                            <Badge
                              variant="secondary"
                              key={option.value}
                              className="truncate rounded-sm px-1 font-normal"
                            >
                              {option.label}
                            </Badge>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </Button>
            </FacetedFilterTrigger>
            <FacetedFilterContent
              id={`${inputId}-listbox`}
              className="w-50 origin-(--radix-popover-content-transform-origin)"
            >
              <FacetedFilterInput
                aria-label={`Search ${filterField?.label} options`}
                placeholder={filterField?.label ?? 'Search options...'}
              />
              <FacetedFilterList>
                <FacetedFilterEmpty>No options found.</FacetedFilterEmpty>
                <FacetedFilterGroup>
                  {filterField?.options?.map((option) => (
                    <FacetedFilterItem
                      key={option.value}
                      value={option.value}
                      selected={selectedValues.has(option.value)}
                      onSelect={(value) => {
                        const currentValue = Array.isArray(filter.value) ? filter.value : [];
                        const newValue = currentValue.includes(value)
                          ? currentValue.filter((v) => v !== value)
                          : [...currentValue, value];
                        updateFilter({
                          rowId: filter.rowId,
                          field: { value: newValue },
                        });
                      }}
                    >
                      {option.icon && <option.icon className="text-muted-foreground mr-2 size-4" aria-hidden="true" />}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </FacetedFilterItem>
                  ))}
                </FacetedFilterGroup>
              </FacetedFilterList>
            </FacetedFilterContent>
          </FacetedFilter>
        );
      case 'date':
        const dateValue = Array.isArray(filter.value)
          ? filter.value.filter(Boolean)
          : [filter.value, filter.value].filter(Boolean);

        const displayValue =
          filter.operator === 'isBetween' && dateValue.length === 2
            ? `${formatDate(dateValue[0] ?? new Date())} - ${formatDate(dateValue[1] ?? new Date())}`
            : dateValue[0]
              ? formatDate(dateValue[0])
              : 'Pick a date';

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} date filter`}
                aria-controls={`${inputId}-calendar`}
                className={cn(
                  'h-8 w-full justify-start gap-2 rounded text-left font-normal',
                  !filter.value && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{displayValue}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent id={`${inputId}-calendar`} align="start" className="w-auto p-0">
              {filter.operator === 'isBetween' ? (
                <Calendar
                  id={`${inputId}-calendar`}
                  mode="range"
                  aria-label={`Select ${filterField.label} date range`}
                  selected={
                    dateValue.length === 2
                      ? {
                          from: new Date(dateValue[0] ?? ''),
                          to: new Date(dateValue[1] ?? ''),
                        }
                      : {
                          from: new Date(),
                          to: new Date(),
                        }
                  }
                  onSelect={(date) => {
                    updateFilter({
                      rowId: filter.rowId,
                      field: {
                        value: date ? [date.from?.toISOString() ?? '', date.to?.toISOString() ?? ''] : [],
                      },
                    });
                  }}
                  initialFocus
                  numberOfMonths={1}
                />
              ) : (
                <Calendar
                  id={`${inputId}-calendar`}
                  mode="single"
                  aria-label={`Select ${filterField.label} date`}
                  selected={dateValue[0] ? new Date(dateValue[0]) : undefined}
                  onSelect={(date) => {
                    updateFilter({
                      rowId: filter.rowId,
                      field: { value: date?.toISOString() ?? '' },
                    });

                    setTimeout(() => {
                      document.getElementById(inputId)?.click();
                    }, 0);
                  }}
                  initialFocus
                />
              )}
            </PopoverContent>
          </Popover>
        );
      case 'boolean': {
        if (Array.isArray(filter.value)) return null;

        return (
          <Select
            value={filter.value}
            onValueChange={(value) => updateFilter({ rowId: filter.rowId, field: { value } })}
          >
            <SelectTrigger
              id={inputId}
              aria-label={`${filterField.label} boolean filter`}
              aria-controls={`${inputId}-listbox`}
              className="h-8 w-full rounded bg-transparent"
            >
              <SelectValue placeholder={filter.value ? 'True' : 'False'} />
            </SelectTrigger>
            <SelectContent id={`${inputId}-listbox`}>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      default:
        return null;
    }
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" size="sm" aria-label="Open filters" aria-controls={`${id}-filter-dialog`}>
          <ListFilter className="size-3" aria-hidden="true" />
          Filters
          {filters.length > 0 && (
            <Badge variant="secondary" className="h-[1.14rem] rounded-[0.2rem] px-[0.40rem] text-[0.65rem] font-normal">
              {filters.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="flex min-w-60 flex-col gap-4 p-4 sm:w-[620px]">
        {filters.length > 0 ? (
          <h4 className="leading-none font-medium">Filters</h4>
        ) : (
          <div className="flex flex-col gap-1">
            <h4 className="text-sm leading-none font-medium">No filters applied</h4>
            <p className="text-muted-foreground text-xs">Add filters to refine your results.</p>
          </div>
        )}

        {filters.length > 0 && (
          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto p-1">
            {filters.map((filter, index) => {
              const filterId = `${id}-filter-${filter.rowId}`;
              const joinOperatorListboxId = `${filterId}-join-operator-listbox`;
              const fieldListboxId = `${filterId}-field-listbox`;
              const fieldTriggerId = `${filterId}-field-trigger`;
              const operatorListboxId = `${filterId}-operator-listbox`;
              const inputId = `${filterId}-input`;
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="min-w-18 text-center">
                    {index === 0 ? (
                      <span className="text-muted-foreground text-sm">Where</span>
                    ) : index === 1 ? (
                      <Select
                        value={joinOperator || ''}
                        onValueChange={(value: JoinOperator) => setJoinOperator(value)}
                      >
                        <SelectTrigger
                          aria-label="Select join operator"
                          aria-controls={joinOperatorListboxId}
                          className="h-8 rounded lowercase"
                        >
                          <SelectValue placeholder={joinOperator} />
                        </SelectTrigger>
                        <SelectContent
                          id={joinOperatorListboxId}
                          position="popper"
                          className="min-w-(--radix-select-trigger-width) lowercase"
                        >
                          {dataTableConfig.joinOperators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground text-sm">{joinOperator}</span>
                    )}
                  </div>
                  <Select
                    value={filter.id}
                    onValueChange={(value) => {
                      const filterField = filterFields.find((col) => col.id === value);

                      if (!filterField) return;

                      updateFilter({
                        rowId: filter.rowId,
                        field: {
                          id: value as StringKeyOf<TData>,
                          type: filterField.type,
                          operator: getDefaultOperator(filterField),
                          value: '',
                        },
                      });
                    }}
                  >
                    <SelectTrigger className="bg-background h-8 w-32 truncate">
                      <div className="truncate">
                        <SelectValue placeholder="Select a field" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {filterFields.map((filterField) => (
                        <SelectItem key={filterField.id} value={filterField.id}>
                          {filterField.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filter.operator}
                    onValueChange={(value: FilterOperator) =>
                      updateFilter({
                        rowId: filter.rowId,
                        field: {
                          operator: value,
                          value: value === 'isEmpty' || value === 'isNotEmpty' ? '' : filter.value,
                        },
                      })
                    }
                  >
                    <SelectTrigger
                      aria-label="Select filter operator"
                      aria-controls={operatorListboxId}
                      className="bg-background h-8 w-32 truncate"
                    >
                      <div className="truncate">
                        <SelectValue placeholder={filter.operator} />
                      </div>
                    </SelectTrigger>
                    <SelectContent id={operatorListboxId}>
                      {getFilterOperators(filter.type).map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="min-w-36 flex-1">{renderFilterInput({ filter, inputId })}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Remove filter ${index + 1}`}
                    className="size-8 shrink-0 rounded"
                    onClick={() => removeFilter(filter.rowId)}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex w-full items-center gap-2">
          <Button size="sm" className="h-[1.85rem] rounded" onClick={addFilter}>
            Add filter
          </Button>
          {filters.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="rounded"
              onClick={() => {
                void setFilters(null);
                void setJoinOperator('and');
              }}
            >
              Reset filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
