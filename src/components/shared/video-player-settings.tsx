import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import Description from "../ui/description";

export default function VideoPlayerSettings({ src }: { src: string }) {
  return (
    <Dialog>
      <DialogTrigger className="w-fit">
        <Description>
          Need help?{" "}
          <span className="underline underline-offset-2">click here</span>
        </Description>
      </DialogTrigger>
      <DialogContent className="!w-7/12 !max-w-full !p-0 bg-transparent !border-none !outline-none !ring-0 !ring-offset-0 shadow-2xl">
        <DialogHeader className="">
          <video className="rounded-2xl w-full" controls>
            <source src={src} />
          </video>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
