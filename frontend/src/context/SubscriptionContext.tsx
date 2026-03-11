import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import api from "../lib/apiClient";
import { useBackendAuth } from "../lib/useBackendAuth";

export type Subscription = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  renewalDate: string;
  notifyBeforeDays: number;
  daysUntilRenewal?: number;
  notes?: string;
};

type SubscriptionContextType = {
  subscriptions: Subscription[];
  totalMonthlySpend: number;
  loading: boolean;
  error: string | null;
  loadSubscriptions: () => Promise<void>;
  addSubscription: (sub: Omit<Subscription, "id">) => Promise<void>;
  updateSubscription: (id: string, sub: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isBackendReady } = useBackendAuth();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalMonthlySpend, setTotalMonthlySpend] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all subscriptions from backend ──
  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/subscriptions");
      const data = res.data.data;
      setSubscriptions(data.subscriptions ?? []);
      setTotalMonthlySpend(data.totalMonthlySpend ?? 0);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { error?: string } } }).response?.data?.error ?? "Failed to load subscriptions")
          : "Failed to load subscriptions";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load when backend is ready
  useEffect(() => {
    if (isBackendReady) {
      loadSubscriptions();
    }
  }, [isBackendReady, loadSubscriptions]);

  // ── Create ──
  const addSubscription = useCallback(
    async (sub: Omit<Subscription, "id">) => {
      try {
        await api.post("/subscriptions", sub);
        await loadSubscriptions(); // refresh list
      } catch {
        setError("Failed to add subscription");
      }
    },
    [loadSubscriptions]
  );

  // ── Update ──
  const updateSubscription = useCallback(
    async (id: string, updatedFields: Partial<Subscription>) => {
      try {
        await api.put(`/subscriptions/${id}`, updatedFields);
        await loadSubscriptions(); // refresh list
      } catch {
        setError("Failed to update subscription");
      }
    },
    [loadSubscriptions]
  );

  // ── Delete ──
  const deleteSubscription = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/subscriptions/${id}`);
        await loadSubscriptions(); // refresh list
      } catch {
        setError("Failed to delete subscription");
      }
    },
    [loadSubscriptions]
  );

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        totalMonthlySpend,
        loading,
        error,
        loadSubscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionProvider"
    );
  }
  return context;
}
