import { db } from "../configs/firebaseAdmin";
import { User } from "../types/user";

const usersCollection = db.collection("users");

export async function findByEmail(email: string): Promise<User | undefined> {
    const snapshot = await usersCollection.where("email", "==", email).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0]!;
    return { id: doc.id, ...doc.data() } as User;
}

export async function findById(id: string): Promise<User | undefined> {
    const doc = await usersCollection.doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as User;
}

export async function create(email: string, hashedPassword: string): Promise<User> {
    const now = new Date().toISOString();
    const data = {
        email,
        password: hashedPassword,
        createdAt: now,
    };
    const docRef = await usersCollection.add(data);
    return { id: docRef.id, ...data };
}
