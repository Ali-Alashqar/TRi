import { toast as sonnerToast } from 'sonner';

export function useToast() {
  const toast = ({ title, description, variant }) => {
    if (variant === 'destructive') {
      sonnerToast.error(title, { description });
    } else {
      sonnerToast.success(title, { description });
    }
  };

  return { toast };
}

