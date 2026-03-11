export interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: string;
    renewalDate: string; // YYYY-MM-DD
    notifyBeforeDays: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateSubscriptionInput = Omit<Subscription, "id" | "createdAt" | "updatedAt">;

export type UpdateSubscriptionInput = Partial<CreateSubscriptionInput>;
