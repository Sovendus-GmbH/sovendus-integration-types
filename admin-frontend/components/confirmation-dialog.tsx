import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import React, { useState, useEffect, useCallback } from "react";
import { InfoIcon, X } from "lucide-react";
import { cn } from "../lib/utils";

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSave: () => Promise<void>;
  instructions?: string;
}

export function ConfigurationDialog({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  instructions,
}: ConfigurationDialogProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    try {
      await onSave();
      setNotification("Settings saved successfully");
    } catch (error) {
      setNotification("Failed to save settings");
    } finally {
      setTimeout(() => setNotification(null), 3000);
    }
  }, [onSave]);

  useEffect(() => {
    if (!open) {
      handleSave();
    }
  }, [open, handleSave]);

  const renderAlert = (content: string, type: "info" | "success" | "error") => (
    <Alert
      className={cn(
        "mb-6",
        type === "info" && "bg-blue-50 border-blue-200",
        type === "success" && "bg-green-50",
        type === "error" && "bg-red-50",
      )}
    >
      {type === "info" && <InfoIcon className="h-4 w-4" />}
      <AlertDescription
        className={cn(
          type === "success" && "text-green-800",
          type === "error" && "text-red-800",
        )}
      >
        {content}
      </AlertDescription>
    </Alert>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-50 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="h-8 w-8" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>

        {instructions && renderAlert(instructions, "info")}

        {children}

        {notification &&
          renderAlert(
            notification,
            notification.includes("success") ? "success" : "error",
          )}
      </DialogContent>
    </Dialog>
  );
}
