import admin from "firebase-admin";
import * as path from "path";

// Load service account key from the configs directory
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
}

export const db = admin.firestore();
export default admin;