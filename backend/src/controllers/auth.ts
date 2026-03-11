import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userStore from "../store/users";
import { signupSchema, loginSchema } from "../validators/auth";
import { JWT_SECRET } from "../middleware/auth";

function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export async function signup(req: Request, res: Response): Promise<void> {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }

    const { email, password } = result.data;

    // Check if user already exists (Firestore)
    const existingUser = await userStore.findByEmail(email);
    if (existingUser) {
        res.status(409).json({ success: false, error: "Email already registered" });
        return;
    }

    // Hash password and create user in Firestore
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userStore.create(email, hashedPassword);
    const token = generateToken(user.id);

    res.status(201).json({
        success: true,
        data: {
            token,
            user: { id: user.id, email: user.email },
        },
    });
}

export async function login(req: Request, res: Response): Promise<void> {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }

    const { email, password } = result.data;

    const user = await userStore.findByEmail(email);
    if (!user) {
        res.status(401).json({ success: false, error: "Invalid email or password" });
        return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        res.status(401).json({ success: false, error: "Invalid email or password" });
        return;
    }

    const token = generateToken(user.id);
    res.json({
        success: true,
        data: {
            token,
            user: { id: user.id, email: user.email },
        },
    });
}
