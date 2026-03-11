import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { BackendAuthProvider } from './lib/useBackendAuth';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local');
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BackendAuthProvider>
        <SubscriptionProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login/*" element={<Login />} />
                <Route path="/signup/*" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </BackendAuthProvider>
    </ClerkProvider>
  )
}

export default App
