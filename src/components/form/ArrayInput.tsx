import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ArrayInputProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  minItems?: number;
  maxItems?: number;
  [key: string]: unknown;
}

const ArrayInput: React.FC<ArrayInputProps> = ({
  name,
  label,
  placeholder = "Add item",
  description,
  disabled = false,
  minItems = 0,
  maxItems,
  ...props
}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() && (!maxItems || fields.length < maxItems)) {
      append(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder={placeholder}
                  disabled={disabled || (maxItems !== undefined && fields.length >= maxItems)}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  {...props}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAdd}
                  disabled={
                    disabled ||
                    !inputValue.trim() ||
                    (maxItems !== undefined && fields.length >= maxItems)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {fields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fields.map((field, index) => (
                    <Badge
                      key={field.id}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      <span>{String(field.value || '')}</span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={disabled || (minItems > 0 && fields.length <= minItems)}
                        className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                        aria-label={`Remove ${field.value}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ArrayInput;

