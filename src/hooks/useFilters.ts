import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface FilterConfig {
  key: string;
  type: "text" | "number" | "array";
  transformParams?: (value: any) => any; // Updated name here
  matchFn: (item: any, filterValue: any) => boolean;
}

interface UseFiltersProps {
  data: any[];
  filterConfig: FilterConfig[];
}

export function useFilters({ data, filterConfig }: UseFiltersProps) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const searchParams = useSearchParams();

  const initializeFilters = () => {
    return filterConfig.reduce(
      (acc: Record<string, any>, { key, transformParams }) => {
        const searchValue = searchParams.get(key);
        const initialValue = searchValue ? searchValue.split(",") : [];
        acc[key] = transformParams
          ? transformParams(initialValue)
          : initialValue;
        return acc;
      },
      {}
    );
  };

  const [filters, setFilters] = useState(initializeFilters);

  useEffect(() => {
    const applyFilters = () => {
      return data.filter((item) => {
        const matchesSearch = search
          ? item.name.toLowerCase().includes(search.toLowerCase())
          : true;

        const matchesFilters = filterConfig.every(({ key, matchFn }) => {
          const filterValue = filters[key];
          return !filterValue.length || matchFn(item, filterValue);
        });

        return matchesSearch && matchesFilters;
      });
    };

    setFilteredData(applyFilters());
  }, [data, search, filters]);

  return {
    search,
    setSearch,
    filters,
    setFilters,
    data: filteredData,
    count: Object.values(filters).filter((v: any) => v.length).length,
  };
}
