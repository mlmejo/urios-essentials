import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().nullable(),
  price: z.string().transform((arg) => {
    let p = parseFloat(arg);
    if (isNaN(p)) {
      throw new Error("Invalid number");
    }
    return p;
  }),
  stock: z.string().transform((arg) => {
    let p = parseFloat(arg);
    if (isNaN(p)) {
      throw new Error("Invalid number");
    }
    return p;
  }),
  category: z.string().min(1, "Category is required"),
});
