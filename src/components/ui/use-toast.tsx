import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const toast = ({ title, description, variant = "default", ...props }: ToastProps = {}) => {
    sonnerToast[variant === "destructive" ? "error" : "success"]((
      <div className="grid gap-1">
        {title && <h4 className="font-medium">{title}</h4>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    ), props);
  };

  return {
    toast,
  };
}