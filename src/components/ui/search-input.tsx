import { ALargeSmall, WholeWord } from "lucide-react";
import React from "react";
import { Button } from "./button";
import { Input } from "./input";

interface SearchInputProps {
  filters: {
    search: string;
    caseSensitive: boolean;
    wholeWord: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  className?: string;
  [key: string]: any; // Allow any other props
}

export default function SearchInput({
  filters,
  setFilters,
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        value={filters.search}
        onChange={(e) =>
          setFilters((prev: any) => ({ ...prev, search: e.target.value }))
        }
        {...props}
      />
      <div className="absolute right-3 flex items-center gap-1">
        <Button
          variant={filters.caseSensitive ? "secondary" : "ghost"}
          size="icon"
          className="size-6 rounded-sm"
          onClick={() =>
            setFilters((prev: any) => ({
              ...prev,
              caseSensitive: !prev.caseSensitive,
            }))
          }
        >
          <ALargeSmall className="size-4" />
        </Button>
        <Button
          variant={filters.wholeWord ? "secondary" : "ghost"}
          size="icon"
          className="size-6 rounded-sm"
          onClick={() =>
            setFilters((prev: any) => ({
              ...prev,
              wholeWord: !prev.wholeWord,
            }))
          }
        >
          <WholeWord className="size-4" />
        </Button>
      </div>
    </div>
  );
}
