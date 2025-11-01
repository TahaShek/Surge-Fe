# Reusable Form Components

This directory contains reusable form components that work with **react-hook-form**, **Zod**, and **shadcn/ui**.

## Components

### TextInput

A reusable text input component that integrates with react-hook-form's `FormField` and shadcn's form components.

#### Usage

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/form";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <TextInput
          name="name"
          label="Full Name"
          placeholder="John Doe"
          description="Enter your full name"
        />
        <TextInput
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
        />
      </form>
    </Form>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Field name (must match schema) |
| `label` | `string` | required | Label text |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | Input type |
| `placeholder` | `string` | - | Placeholder text |
| `description` | `string` | - | Help text below input |
| `disabled` | `boolean` | `false` | Disable input |

#### Array Mapping Pattern

You can map over an array of field configs for cleaner forms:

```tsx
const fields = [
  { name: "firstName", label: "First Name", type: "text" as const },
  { name: "email", label: "Email", type: "email" as const },
];

<div className="grid grid-cols-12 gap-4">
  {fields.map((field) => (
    <div key={field.name} className="col-span-12">
      <TextInput {...field} />
    </div>
  ))}
</div>
```

## Example

See `/src/features/user-form` for a complete working example.

