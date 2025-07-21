import { Filter } from '@/types';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { toast } from 'sonner';

import { ParsedSearchParams } from '@/hooks/use-data-table';

export const applyFiltersParamsToQuery = (query: any, params: ParsedSearchParams<{}>) => {
  try {
    const { page, perPage, sort, filters = [], joinOperator = 'and' } = params;

    // Pagination
    // console.log('perPage', perPage);
    // console.log('page', page);
    // console.log('from', page - 1);
    // console.log('to', page * perPage - 1);

    query = query.limit(perPage).range((page - 1) * perPage, page * perPage - 1);

    // Sorting
    sort?.forEach((s: any) => {
      query = query.order(s.id, { ascending: !s.desc });
    });

    const orConditions: string[] = [];

    const applyFilter = (filter: Filter<any>, isOr = false) => {
      const { id: col, value: val, operator } = filter;

      const formatDate = (date: any) => new Date(date).toISOString();

      const handleDateRange = (range: any[]) => {
        const [start, end] = range;
        if (start) return [`${col}.gte.${formatDate(startOfDay(new Date(start)))}`];
        if (end) return [`${col}.lte.${formatDate(endOfDay(new Date(end)))}`];
        return [];
      };

      const handleRelativeDate = (val: string) => {
        const [amountStr, unit] = val.split(' ');
        const amount = parseInt(amountStr);
        const today = new Date();

        let start: Date, end: Date;

        switch (unit) {
          case 'days':
            start = startOfDay(addDays(today, amount));
            end = endOfDay(start);
            break;
          case 'weeks':
            start = startOfDay(addDays(today, amount * 7));
            end = endOfDay(addDays(start, 6));
            break;
          case 'months':
            start = startOfDay(addDays(today, amount * 30));
            end = endOfDay(addDays(start, 29));
            break;
          default:
            return [];
        }

        return [`${col}.gte.${start.toISOString()}`, `${col}.lte.${end.toISOString()}`];
      };

      const add = (method: string, ...args: any[]) => {
        query = query[method](...args);
      };

      const or = (cond: string | string[]) => {
        orConditions.push(...(Array.isArray(cond) ? cond : [cond]));
      };

      const action = isOr ? or : add;

      switch (operator) {
        case 'eq':
          return action(isOr ? `${col}.eq.${val}` : 'eq', col, val);
        case 'ne':
          return action(isOr ? `${col}.neq.${val}` : 'neq', col, val);
        case 'iLike':
          return action(isOr ? `${col}.ilike.*${val}*` : 'ilike', col, `%${val}%`);
        case 'notILike':
          return action(isOr ? `${col}.not.ilike.*${val}*` : 'not', col, 'ilike', `%${val}%`);
        case 'lt':
          return action(isOr ? `${col}.lt.${val}` : 'lt', col, val);
        case 'lte':
          return action(isOr ? `${col}.lte.${val}` : 'lte', col, val);
        case 'gt':
          return action(isOr ? `${col}.gt.${val}` : 'gt', col, val);
        case 'gte':
          return action(isOr ? `${col}.gte.${val}` : 'gte', col, val);
        case 'isEmpty':
          return action(isOr ? `${col}.is.null` : 'is', col, null);
        case 'isNotEmpty':
          return action(isOr ? `${col}.not.is.null` : 'not', col, 'is', null);
        case 'isBetween':
          if (Array.isArray(val)) {
            const conditions = handleDateRange(val);
            return isOr ? or(conditions) : conditions.forEach((c) => (query = query.or(c)));
          }
          break;
        case 'isRelativeToToday':
          if (typeof val === 'string') {
            const conditions = handleRelativeDate(val);
            return isOr ? or(conditions) : conditions.forEach((c) => (query = query.or(c)));
          }
          break;
        default:
          console.warn(`Unsupported operator: ${operator}`);
      }
    };

    filters.forEach((filter: any) => applyFilter(filter, joinOperator === 'or'));

    if (orConditions.length > 0) {
      query = query.or(orConditions.join(','));
    }

    return query;
  } catch (err) {
    toast.error('Error building query');
    console.error(err);
    return query;
  }
};

export function getValidFilters<TData>(filters: Filter<TData>[]): Filter<TData>[] {
  return filters.filter(
    ({ value, operator }) =>
      operator === 'isEmpty' ||
      operator === 'isNotEmpty' ||
      (Array.isArray(value) ? value.length > 0 : value != null && value !== ''),
  );
}
