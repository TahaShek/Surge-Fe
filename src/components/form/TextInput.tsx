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
import { Input } from "@/components/ui/input";

export interface TextInputProps {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  description,
  disabled = false,
  ...props
}) => {
  const { control } = useFormContext();

  // Filter out custom props that shouldn't be passed to DOM elements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { gridClass, ...inputProps } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              value={field.value ?? ''}
              {...inputProps}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInput;

