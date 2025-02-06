import { X } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { cn } from "../lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  zoomedVersion: boolean;
}

export function ConfigurationDialog({
  open,
  onOpenChange,
  title,
  children,
  zoomedVersion,
}: ConfigurationDialogProps): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-w-[1200px] max-h-[90vh] overflow-y-auto", {
          zoomed: zoomedVersion,
        })}
        withClose={false}
      >
        <div className={cn("sticky top-0 z-50 flex justify-end h-[55px]")}>
          <div className={cn("flex items-center gap-2")}>
            <button
              onClick={(): void => onOpenChange(false)}
              className={cn(
                "p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors",
              )}
            >
              <X className={cn("h-8 w-8")} />
              <span className={cn("sr-only")}>Close</span>
            </button>
          </div>
        </div>
        <DialogHeader className={cn("pb-6")} style={{ marginTop: "-55px" }}>
          <DialogTitle className={cn("text-2xl")}>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
