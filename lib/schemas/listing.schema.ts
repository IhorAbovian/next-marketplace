import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number<number>().min(1, "Price must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const editListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .nullable()
    .optional(),
  price: z.coerce
    .number<number>()
    .min(1, "Price must be greater than 0")
    .optional(),
  categoryId: z.string().min(1, "Category is required").optional(),
  imageUrl: z.string().optional(),
});

export type EditListingInput = z.infer<typeof editListingSchema>;
