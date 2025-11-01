import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const showToast = (type: ToastType, options: ToastOptions = {}) => {
    const { title, description, duration = 3000, action } = options;

    const message = title ? (
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{title}</span>
        {description && <span className="text-sm opacity-90">{description}</span>}
      </div>
    ) : (
      description
    );

    switch (type) {
      case 'success':
        toast.success(message, { duration, action });
        break;
      case 'error':
        toast.error(message, { duration, action });
        break;
      case 'warning':
        toast.warning(message, { duration, action });
        break;
      case 'info':
        toast.info(message, { duration, action });
        break;
      default:
        toast(message, { duration, action });
    }
  };

  return {
    success: (options: ToastOptions) => showToast('success', options),
    error: (options: ToastOptions) => showToast('error', options),
    warning: (options: ToastOptions) => showToast('warning', options),
    info: (options: ToastOptions) => showToast('info', options),
    promise: toast.promise,
    dismiss: toast.dismiss,
    custom: toast,
  };
}