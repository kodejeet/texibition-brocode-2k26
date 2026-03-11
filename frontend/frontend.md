FRONTEND RESPONSIBILITIES

Goal:
Build a simple dashboard where users manage subscriptions.

Authentication:
Clerk (Google login + email signup)

--------------------------------------------------

FILES TO CREATE

app/page.tsx  
Landing page

app/auth/login/page.tsx  
Login page

app/auth/signup/page.tsx  
Signup page

app/dashboard/page.tsx  
Main dashboard

app/dashboard/components/SubscriptionForm.tsx  
Form for adding/editing subscriptions

app/dashboard/components/SubscriptionList.tsx  
List of subscriptions

lib/apiClient.ts  
HTTP client wrapper

--------------------------------------------------

FRONTEND IMPLEMENTATION STEPS

1. Initialize Next.js project

npx create-next-app@latest --ts

--------------------------------------------------

2. Install minimal dependencies

npm install @clerk/nextjs
npm install axios react-hook-form date-fns

--------------------------------------------------

3. Setup Clerk Authentication

Create a Clerk account.

Create a new application.

Enable authentication providers:

• Google OAuth
• Email / Password

--------------------------------------------------

4. Add Clerk environment variables

Create `.env.local`

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

--------------------------------------------------

5. Configure Clerk Provider

Update `app/layout.tsx`

Wrap the application with ClerkProvider.

Example:

import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  )
}

--------------------------------------------------

6. Implement Signup Page

File:

app/auth/signup/page.tsx

Use Clerk signup component.

Example:

import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return <SignUp />
}

--------------------------------------------------

7. Implement Login Page

File:

app/auth/login/page.tsx

Example:

import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return <SignIn />
}

--------------------------------------------------

8. Protect Dashboard Route

Use Clerk authentication guard.

Example:

import { auth } from "@clerk/nextjs/server"

export default function Dashboard() {
  const { userId } = auth()

  if (!userId) {
    redirect("/auth/login")
  }

  return <div>Dashboard</div>
}

--------------------------------------------------

9. Get Current User ID

Clerk automatically provides a unique `userId`.

Use this ID when calling backend APIs.

Example:

const userId = user?.id

--------------------------------------------------

10. Create API Client

File:

lib/apiClient.ts

Example:

import axios from "axios"

const api = axios.create({
  baseURL: "/api"
})

export default api

--------------------------------------------------

11. Build Dashboard

File:

app/dashboard/page.tsx

Load subscriptions using API.

Display:

• subscription list  
• upcoming renewals  
• monthly total

--------------------------------------------------

12. Implement Subscription Form

Fields:

name  
price  
renewalDate  
notifyBeforeDays

--------------------------------------------------

13. Implement Subscription List

Features:

edit subscription  
delete subscription  
show next renewal  
display monthly total

--------------------------------------------------

14. Display Monthly Spending

Example calculation:

total = subscriptions.reduce(
  (sum, s) => sum + s.price,
  0
)