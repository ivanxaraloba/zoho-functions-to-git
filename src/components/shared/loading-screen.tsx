import React from 'react';

import { LoaderCircle } from 'lucide-react';

import { TypographyH1 } from '../typography/typography-h1';
import { TypographyH3 } from '../typography/typography-h3';

export default function LoadingScreen() {
  return (
    <>
      <div>
        <div className="fixed left-0 top-0 w-full items-center justify-center bg-background/50">
          <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
            {/* <TypographyH3 className="text-muted-foreground">Z2G</TypographyH3> */}
            {/* <div className="flex space-x-2">
              <div className="size-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="size-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.20s]"></div>
              <div className="size-2 bg-muted-foreground rounded-full animate-bounce"></div>
            </div> */}
            <div className="relative grid place-items-center">
              <span className="absolute animate-pulse text-muted-foreground text-sm">Z2G</span>
              <LoaderCircle strokeWidth={0.1} className="size-20 animate-spin text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
