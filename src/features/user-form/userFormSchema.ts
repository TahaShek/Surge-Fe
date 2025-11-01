import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." })
    .max(50, { message: "First name must not exceed 50 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .max(50, { message: "Last name must not exceed 50 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  cellPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number." })
    .regex(/^[0-9\-\s()]+$/, {
      message: "Phone number can only contain numbers, spaces, dashes, and parentheses.",
    }),
  address1: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." })
    .max(100, { message: "Address must not exceed 100 characters." }),
  address2: z.string().max(100).optional(),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters." })
    .max(50),
  zipCode: z
    .string()
    .min(5, { message: "ZIP code must be at least 5 characters." })
    .max(10),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

