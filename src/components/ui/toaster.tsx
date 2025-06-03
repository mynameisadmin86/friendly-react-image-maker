
import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

// This component is now a simple wrapper that doesn't rely on complex state
export function Toaster() {
  // We don't actually use toasts from useToast anymore
  // This is just here for compatibility
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  );
}
