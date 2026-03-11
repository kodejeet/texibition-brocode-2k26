import { db } from "../configs/firebaseAdmin";
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from "../types/subscription";

/**
 * Firestore structure: users/{userId}/subscriptions/{subscriptionId}
 */
function subsCollection(userId: string) {
    return db.collection("users").doc(userId).collection("subscriptions");
}

export async function getAllByUser(userId: string): Promise<Subscription[]> {
    const snapshot = await subsCollection(userId).get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Subscription[];
}

export async function getById(id: string, userId: string): Promise<Subscription | undefined> {
    const doc = await subsCollection(userId).doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as Subscription;
}

export async function create(userId: string, input: CreateSubscriptionInput): Promise<Subscription> {
    const now = new Date().toISOString();
    const data = {
        ...input,
        createdAt: now,
        updatedAt: now,
    };
    const docRef = await subsCollection(userId).add(data);
    return { id: docRef.id, ...data };
}

export async function update(
    id: string,
    userId: string,
    input: UpdateSubscriptionInput
): Promise<Subscription | null> {
    const docRef = subsCollection(userId).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
    };
    await docRef.update(updateData);

    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as Subscription;
}

export async function remove(id: string, userId: string): Promise<boolean> {
    const docRef = subsCollection(userId).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
}

// Get all subscriptions across all users — for alert checking
export async function getAll(): Promise<(Subscription & { userId: string })[]> {
    const snapshot = await db.collectionGroup("subscriptions").get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.ref.parent.parent?.id ?? "",
        ...doc.data(),
    })) as (Subscription & { userId: string })[];
}
