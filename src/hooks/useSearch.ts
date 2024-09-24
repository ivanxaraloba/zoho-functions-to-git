import { useState } from "react";

export function useSearch<T>(
  data: T[],
  searchKey: keyof T,
  additionalKeys: (keyof T)[] = []
) {
  const [filters, setFilters] = useState({
    search: "",
    caseSensitive: false,
    wholeWord: false,
  });

  const filteredData = data.filter((item) => {
    let searchValue = filters.search || "";
    if (!searchValue) return true;

    let primaryValue = item[searchKey] as unknown as string;
    let additionalValues = additionalKeys.map(
      (key) => item[key] as unknown as string
    );

    if (!filters.caseSensitive) {
      primaryValue = primaryValue?.toLowerCase() || "";
      additionalValues = additionalValues.map(
        (val) => val?.toLowerCase() || ""
      );
      searchValue = searchValue.toLowerCase();
    }

    if (filters.wholeWord) {
      const regex = new RegExp(
        `\\b${searchValue}\\b`,
        filters.caseSensitive ? "" : "i"
      );
      return (
        regex.test(primaryValue) ||
        additionalValues.some((val) => regex.test(val))
      );
    }

    return (
      primaryValue.includes(searchValue) ||
      additionalValues.some((val) => val.includes(searchValue))
    );
  });

  return {
    data: filteredData,
    filters,
    setFilters,
  };
}
