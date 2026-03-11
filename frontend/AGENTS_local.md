# AGENTS.md

Reference: design notes and agentic workflow ideas (see text.md).

You are an AI acting as a **senior full-stack engineer** with strong experience in both backend and frontend systems.

Your task is to build a clean MVP of a **Subscription Manager & Alert System** using:

Tech stack:
- Next.js
- React
- TypeScript
- Firebase (Auth, Firestore, Cloud Functions)
- Vercel (deployment)

The system must stay minimal, modular, and maintainable.

Do not over-engineer. Focus on clarity and working features.


--------------------------------------------------

PROJECT OVERVIEW

Build a web application that allows users to:

• Add their recurring subscriptions (Netflix, Gym, Spotify, etc.)
• Track total monthly spending
• View upcoming renewals
• Receive alerts before a subscription renews

Example:

Subscription: Netflix  
Price: ₹499  
Renewal Date: 2026-04-10  

If notifyBeforeDays = 3  
User receives an alert on 2026-04-07.


--------------------------------------------------

AI AGENT ROLE

Act as a **senior engineer** and follow these principles:

• prefer simple architecture
• keep code modular
• avoid unnecessary libraries
• enforce strong TypeScript typing
• ensure the project builds successfully
• validate all inputs
• keep commits small and logical

Always verify:

1. TypeScript build passes
2. API endpoints return correct responses
3. Firebase security rules protect user data
4. Alerts run without duplication


--------------------------------------------------

CORE FEATURES (MVP)

1. User authentication
   Email + password using Firebase Auth

2. Subscription CRUD
   Create, read, update, delete subscriptions

3. Dashboard
   View all subscriptions
   Display total monthly cost
   Show upcoming renewals

4. Alerts
   Email or push notification before renewal date

5. Deployment
   Next.js app deployed on Vercel
   Firebase functions deployed on Firebase


--------------------------------------------------

PROJECT STRUCTURE

Use a single Next.js project with Firebase functions.

root/

app/ or pages/
frontend UI routes

lib/
shared utilities

server/
server utilities

functions/
firebase cloud functions

Example structure:

/
├─ app/
│  ├─ page.tsx
│  ├─ dashboard/
│  │  └─ page.tsx
│  └─ auth/
│     ├─ login.tsx
│     └─ signup.tsx
│
├─ lib/
│  ├─ firebaseClient.ts
│  └─ apiClient.ts
│
├─ server/
│  └─ firebaseAdmin.ts
│
├─ app/api/
│  └─ subscriptions/
│     └─ route.ts
│
├─ functions/
│  └─ index.ts
│
├─ package.json
├─ .env.local
└─ AGENTS.md


--------------------------------------------------

DATABASE MODEL (FIRESTORE)

Collection:

users/{uid}/subscriptions


Each subscription document:

{
  name: string
  price: number
  currency: string
  renewalDate: string
  notifyBeforeDays: number
  notes?: string
  createdAt: timestamp
  updatedAt: timestamp
}


Example:

{
  name: "Netflix",
  price: 499,
  currency: "INR",
  renewalDate: "2026-04-10",
  notifyBeforeDays: 3
}


--------------------------------------------------


--------------------------------------------------



--------------------------------------------------







--------------------------------------------------

ALERT SYSTEM LOGIC

1. Scheduled job runs daily.

2. For each subscription:

daysUntilRenewal =
differenceInDays(renewalDate, today)

3. If:

daysUntilRenewal <= notifyBeforeDays

Send notification.

4. Store alert record to prevent duplicates.


--------------------------------------------------

TESTING

Verify:

• user signup
• login
• add subscription
• edit subscription
• delete subscription
• total monthly spend calculation
• renewal detection logic

Test edge cases:

month boundaries  
timezone differences


--------------------------------------------------

DEPLOYMENT

Frontend deployment:

Push repository to GitHub.

Connect repository to Vercel.

Set environment variables.

Deploy automatically.


Backend deployment:

Deploy Firebase Cloud Functions.

firebase deploy --only functions


--------------------------------------------------

MINIMAL DEPENDENCIES

Frontend

next  
react  
react-dom  
firebase  
axios  
react-hook-form  
date-fns

Backend

firebase-admin  
firebase-functions  
@sendgrid/mail


--------------------------------------------------

MVP CHECKLIST

[ ] Next.js project created  
[ ] Firebase project configured  
[ ] Authentication working  
[ ] Subscription CRUD API implemented  
[ ] Dashboard UI built  
[ ] Monthly spend calculation  
[ ] Alert scheduler implemented  
[ ] Email notifications working  
[ ] Deployment on Vercel completed


--------------------------------------------------

END GOAL

Deliver a clean working MVP where users can:

• manage subscriptions
• track monthly spending
• receive renewal alerts

Focus on shipping a stable minimal product before adding advanced features.