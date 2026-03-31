import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import subscriptionRoutes from "./routes/subscriptions";
import alertRoutes from "./routes/alerts";

const app = express();
const PORT = process.env.PORT || 8000;

// ── Middleware ──
app.use(cors({
    origin: [
        "https://sub-trackerr.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express.json());

// ── Routes ──
app.get("/", (_req, res) => {
    res.json({
        message: "Subscription Manager API",
        version: "2.0.0",
        endpoints: {
            auth: {
                signup: "POST /api/auth/signup",
                login: "POST /api/auth/login",
            },
            subscriptions: "GET|POST /api/subscriptions",
            alerts: "GET /api/alerts",
        },
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/alerts", alertRoutes);

// ── Start ──
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 API docs: http://localhost:${PORT}/`);
});
