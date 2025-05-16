
import { toast } from "sonner";

// Re-export the toast function from sonner
export { toast };

// For compatibility with existing code, provide a useToast hook
export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    }
  };
}
