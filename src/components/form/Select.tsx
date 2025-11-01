import React from 'react';
import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Select({
  name,
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  description,
  disabled,
  required,
  className,
  size = 'md',
}: SelectProps) {
  const id = `select-${name}`;
  
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg',
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </Label>
      )}
      
      <SelectUI
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(
            sizeClasses[size],
            error && "border-red-500 focus:ring-red-500",
            "w-full"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                "flex items-center gap-2",
                option.disabled && "opacity-50"
              )}
            >
              {option.icon}
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectUI>

      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
