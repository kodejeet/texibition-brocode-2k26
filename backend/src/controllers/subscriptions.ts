import { Request, Response } from "express";
import * as store from "../store/subscriptions";
import {
    createSubscriptionSchema,
    updateSubscriptionSchema,
} from "../validators/subscription";

// ── Helpers ──

function daysUntilRenewal(renewalDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(renewalDate);
    renewal.setHours(0, 0, 0, 0);
    const diffMs = renewal.getTime() - today.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// ── Controllers ──

export async function getAllSubscriptions(_req: Request, res: Response): Promise<void> {
    const userId = res.locals.userId as string;
    const subs = await store.getAllByUser(userId);
    const totalMonthlySpend = subs.reduce((sum, s) => sum + s.price, 0);
    const upcomingRenewals = subs
        .map((s) => ({
            ...s,
            daysUntilRenewal: daysUntilRenewal(s.renewalDate),
        }))
        .filter((s) => s.daysUntilRenewal >= 0)
        .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

    res.json({
        success: true,
        data: {
            subscriptions: subs,
            totalMonthlySpend,
            currency: "INR",
            upcomingRenewals,
        },
    });
}

export async function getSubscription(req: Request, res: Response): Promise<void> {
    const userId = res.locals.userId as string;
    const id = req.params.id as string;
    const sub = await store.getById(id, userId);
    if (!sub) {
        res.status(404).json({ success: false, error: "Subscription not found" });
        return;
    }
    res.json({
        success: true,
        data: {
            ...sub,
            daysUntilRenewal: daysUntilRenewal(sub.renewalDate),
        },
    });
}

export async function createSubscription(req: Request, res: Response): Promise<void> {
    const userId = res.locals.userId as string;
    const result = createSubscriptionSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }

    const sub = await store.create(userId, result.data);
    res.status(201).json({ success: true, data: sub });
}

export async function updateSubscription(req: Request, res: Response): Promise<void> {
    const userId = res.locals.userId as string;
    const result = updateSubscriptionSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }

    const id = req.params.id as string;
    const updated = await store.update(id, userId, result.data);
    if (!updated) {
        res.status(404).json({ success: false, error: "Subscription not found" });
        return;
    }
    res.json({ success: true, data: updated });
}

export async function deleteSubscription(req: Request, res: Response): Promise<void> {
    const userId = res.locals.userId as string;
    const id = req.params.id as string;
    const removed = await store.remove(id, userId);
    if (!removed) {
        res.status(404).json({ success: false, error: "Subscription not found" });
        return;
    }
    res.json({ success: true, message: "Subscription deleted" });
}
