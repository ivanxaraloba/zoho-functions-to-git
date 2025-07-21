import { ColumnType, FilterOperator } from '@/types';
import { Row } from '@tanstack/react-table';

export const dataTableConfig = {
  textOperators: [
    { label: 'Contains', value: 'iLike' as const },
    { label: 'Does not contain', value: 'notILike' as const },
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const },
  ],
  numericOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is less than', value: 'lt' as const },
    { label: 'Is less than or equal to', value: 'lte' as const },
    { label: 'Is greater than', value: 'gt' as const },
    { label: 'Is greater than or equal to', value: 'gte' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const },
  ],
  dateOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is before', value: 'lt' as const },
    { label: 'Is after', value: 'gt' as const },
    { label: 'Is on or before', value: 'lte' as const },
    { label: 'Is on or after', value: 'gte' as const },
    { label: 'Is between', value: 'isBetween' as const },
    {
      label: 'Is relative to today',
      value: 'isRelativeToToday' as const,
    },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const },
  ],
  selectOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const },
  ],
  booleanOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
  ],
  joinOperators: [
    { label: 'And', value: 'and' as const },
    { label: 'Or', value: 'or' as const },
  ],
  sortOrders: [
    { label: 'Asc', value: 'asc' as const },
    { label: 'Desc', value: 'desc' as const },
  ],
  columnTypes: [
    'text',
    'number',
    'date',
    'boolean',
    'select',
    'multi-select',
  ] as const,
  globalOperators: [
    'iLike',
    'notILike',
    'eq',
    'ne',
    'isEmpty',
    'isNotEmpty',
    'lt',
    'lte',
    'gt',
    'gte',
    'isBetween',
    'isRelativeToToday',
    'and',
    'or',
  ] as const,
};

export type DataTableConfig = typeof dataTableConfig;

export function getFilterOperators(columnType: ColumnType) {
  const operatorMap: Record<
    ColumnType,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    select: dataTableConfig.selectOperators,
    'multi-select': dataTableConfig.selectOperators,
    boolean: dataTableConfig.booleanOperators,
    date: dataTableConfig.dateOperators,
  };

  return operatorMap[columnType] ?? dataTableConfig.textOperators;
}


export interface TableData {
  data: any[];
  pageCount: number;
}

export interface RowAction<TData> {
  row: Row<TData>;
  action: 'view' | 'create';
}