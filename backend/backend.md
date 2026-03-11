BACKEND RESPONSIBILITIES

Goal:
Securely expose subscription APIs and run alert scheduler.

Authentication:
Clerk user authentication

--------------------------------------------------

FILES TO CREATE

server/firebaseAdmin.ts  
Initialize Firebase Admin SDK

app/api/subscriptions/route.ts  
Next.js API route

functions/index.ts  
Firebase Cloud Function scheduler

lib/validators.ts  
Payload validation

--------------------------------------------------

BACKEND IMPLEMENTATION STEPS

1. Initialize Firebase Admin

File:

server/firebaseAdmin.ts

Use Firebase service account credentials.

--------------------------------------------------

2. Verify Clerk User Identity

Backend must verify the authenticated Clerk user.

Use Clerk server helper:

import { auth } from "@clerk/nextjs/server"

Example:

const { userId } = auth()

if (!userId) {
  return new Response("Unauthorized", { status: 401 })
}

--------------------------------------------------

3. Implement CRUD endpoints

GET /api/subscriptions

Return all subscriptions belonging to the authenticated user.

POST /api/subscriptions

Create new subscription.

PUT /api/subscriptions/:id

Update subscription.

DELETE /api/subscriptions/:id

Delete subscription.

--------------------------------------------------

4. Store Documents

Firestore structure:

users/{userId}/subscriptions/{subscriptionId}

Example document:

{
  name: "Netflix",
  price: 499,
  currency: "INR",
  renewalDate: "2026-04-10",
  notifyBeforeDays: 3
}

--------------------------------------------------

5. Validate Inputs

Ensure:

price > 0  
renewalDate valid  
notifyBeforeDays >= 0

Use validation helper inside:

lib/validators.ts

--------------------------------------------------

6. Renewal Calculation Helper

Example logic:

daysUntilRenewal =
differenceInDays(renewalDate, today)

--------------------------------------------------

7. Implement Alert Scheduler

Create Firebase Cloud Function.

Runs once daily.

Algorithm:

for each user subscription
    if daysUntilRenewal <= notifyBeforeDays
        send alert

--------------------------------------------------

8. Alert Methods

Option 1

Email via SendGrid

Option 2

Push notification via Firebase Cloud Messaging

--------------------------------------------------

ENVIRONMENT VARIABLES

Backend / Vercel

FIREBASE_ADMIN_PROJECT_ID  
FIREBASE_ADMIN_CLIENT_EMAIL  
FIREBASE_ADMIN_PRIVATE_KEY  

--------------------------------------------------

OPTIONAL EMAIL SERVICE

SENDGRID_API_KEY  
NOTIFY_EMAIL_FROM