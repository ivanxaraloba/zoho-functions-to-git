"use client";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function TypographyH1({ children, back }: any) {
  const router = useRouter();
  return (
    <div className={cn("flex items-center gap-2 w-fit min-h-9")}>
      {back && (
        <button onClick={() => back && router.back()}>
          <ChevronLeft className="size-4" />
        </button>
      )}
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text2xl">
        {children}
      </h1>
    </div>
  );
}
