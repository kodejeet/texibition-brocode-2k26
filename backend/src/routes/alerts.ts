import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";
import * as store from "../store/subscriptions";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.userId as string;
    const subs = await store.getAllByUser(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alerts = subs
        .map((s) => {
            const renewal = new Date(s.renewalDate);
            renewal.setHours(0, 0, 0, 0);
            const diffMs = renewal.getTime() - today.getTime();
            const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            return { ...s, daysUntilRenewal: daysUntil };
        })
        .filter((s) => s.daysUntilRenewal >= 0 && s.daysUntilRenewal <= s.notifyBeforeDays)
        .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

    res.json({
        success: true,
        data: {
            alerts,
            count: alerts.length,
        },
    });
});

export default router;
