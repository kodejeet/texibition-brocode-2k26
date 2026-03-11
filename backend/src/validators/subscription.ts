import { z } from "zod";

export const createSubscriptionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().positive("Price must be greater than 0"),
    currency: z.string().min(1, "Currency is required").default("INR"),
    renewalDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Renewal date must be in YYYY-MM-DD format"),
    notifyBeforeDays: z
        .number()
        .int()
        .min(0, "Notify before days must be >= 0")
        .default(3),
    notes: z.string().optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();
