import { createContext, useContext, useState, type ReactNode } from 'react';

export type Subscription = {
  id: string;
  name: string;
  price: number;
  currency: string;
  renewalDate: string;
  notifyBeforeDays: number;
  notes?: string;
};

type SubscriptionContextType = {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, sub: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Initial mock data based on AGENTS.md example
const initialData: Subscription[] = [
  {
    id: '1',
    name: "Netflix",
    price: 499,
    currency: "INR",
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], // 10 days from now
    notifyBeforeDays: 3
  },
  {
    id: '2',
    name: "Gym Membership",
    price: 1500,
    currency: "INR",
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], // 2 days from now
    notifyBeforeDays: 5
  },
  {
    id: '3',
    name: "Spotify Premium",
    price: 119,
    currency: "INR",
    renewalDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], // 15 days from now
    notifyBeforeDays: 2
  }
];

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialData);

  const addSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub = {
      ...sub,
      id: Math.random().toString(36).substring(2, 9),
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const updateSubscription = (id: string, updatedFields: Partial<Subscription>) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, ...updatedFields } : sub)
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription, updateSubscription, deleteSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}
