import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
    getAllSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
} from "../controllers/subscriptions";

const router = Router();

// All subscription routes require authentication
router.use(authMiddleware);

router.get("/", getAllSubscriptions);
router.get("/:id", getSubscription);
router.post("/", createSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
