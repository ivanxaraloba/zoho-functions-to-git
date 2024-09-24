import { cn } from "@/lib/utils";
import React from "react";

export default function Description({ children, className }: any) {
  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </div>
  );
}
