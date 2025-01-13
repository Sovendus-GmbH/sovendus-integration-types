import { X } from "lucide-react";
import React from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function ConfigurationDialog({
  open,
  onOpenChange,
  title,
  children,
}: ConfigurationDialogProps): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[1200px] max-h-[90vh] overflow-y-auto"
        withClose={false}
      >
        <div className="sticky top-0 z-50 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="h-8 w-8" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
