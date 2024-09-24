import { cn } from "@/lib/utils";

export function TypographyH2({ children, className }: any) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}
