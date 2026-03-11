You are a senior full-stack engineer. Help me connect my React + Vite frontend (using Clerk authentication) to my existing Node/Express backend API so the app uses real data from Firebase instead of dummy/mock data.

Project architecture:

Frontend

* React + Vite + TypeScript
* Clerk authentication already working
* Routes: /login, /signup, /dashboard
* Currently uses dummy data for subscriptions
* Needs to call backend API instead

Backend

* Node + Express + TypeScript
* Firebase Firestore using Firebase Admin SDK
* Backend already working and tested with Postman
* Server running at: http://localhost:8000

Backend API endpoints:

Auth
POST /api/auth/signup
POST /api/auth/login

Subscriptions
GET /api/subscriptions
POST /api/subscriptions
PUT /api/subscriptions/:id
DELETE /api/subscriptions/:id

Alerts
GET /api/alerts

Firestore structure:

users/
{userId}/
email
createdAt
subscriptions/
{subscriptionId}/
name
price
renewalDate
notifyBeforeDays

Goal:

1. Remove all dummy/mock subscription data from the frontend.
2. Fetch subscriptions from the backend API.
3. When a user creates a subscription from the UI, it must call POST /api/subscriptions.
4. When the dashboard loads, it must call GET /api/subscriptions and display the results.
5. Implement delete and edit by calling the backend endpoints.
6. All API requests must include the Clerk session token so the backend can identify the user.

Authentication flow:

Frontend gets token from Clerk:

const token = await getToken();

Every request must include:

Authorization: Bearer <token>

Example:

fetch("http://localhost:8000/api/subscriptions", {
headers: {
Authorization: `Bearer ${token}`
}
})

Implementation tasks:

1. Create a reusable API client file

src/lib/apiClient.ts

This file should:

* automatically attach the Clerk token
* handle GET, POST, PUT, DELETE requests
* use fetch or axios

2. Update SubscriptionContext

src/context/SubscriptionContext.tsx

Replace dummy data with real API calls:

* loadSubscriptions()
* createSubscription()
* deleteSubscription()
* updateSubscription()

3. Dashboard

src/pages/Dashboard.tsx

On page load:

* fetch subscriptions from backend
* calculate total monthly spend from returned data

4. SubscriptionModal or form component

When submitting:
POST /api/subscriptions

Body example:

{
"name": "Netflix",
"price": 499,
"renewalDate": "2026-04-10",
"notifyBeforeDays": 3
}

5. Ensure state updates after creating/deleting/editing subscriptions.

6. Make sure TypeScript types match backend responses.

Important requirements:

* Do not use any mock data.
* All subscription data must come from the backend API.
* Ensure Clerk authentication token is included in requests.
* Keep the implementation clean and production-ready.

Output:

Provide the updated code for:

src/lib/apiClient.ts
src/context/SubscriptionContext.tsx
src/pages/Dashboard.tsx

and any changes required in subscription components.

We will implement the email notification system later, so ignore the alerts scheduler for now.
