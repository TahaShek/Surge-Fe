import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea as TextareaUI } from "@/components/ui/textarea";

export interface TextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  rows?: number;
  [key: string]: unknown;
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  placeholder,
  description,
  disabled = false,
  rows = 4,
  ...props
}) => {
  const { control } = useFormContext();

  // Filter out custom props that shouldn't be passed to DOM elements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { gridClass, ...textareaProps } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TextareaUI
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              {...field}
              value={field.value ?? ''}
              {...textareaProps}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Textarea;

