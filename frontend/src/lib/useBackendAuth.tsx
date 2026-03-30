import React, { useEffect, useState, useCallback, useContext, type ReactNode } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import api, { setBackendToken, clearBackendToken, getBackendToken } from "./apiClient";

export type BackendAuthState = {
    backendToken: string | null;
    isBackendReady: boolean;
    error: string | null;
};

export const BackendAuthContext = React.createContext<BackendAuthState>({
    backendToken: null,
    isBackendReady: false,
    error: null,
});

/**
 * Bridge between Clerk authentication and the backend's own JWT system.
 *
 * After the user signs in with Clerk, this provider automatically
 * registers / logs-in with the backend and stores the backend JWT.
 */
export function BackendAuthProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded: isUserLoaded } = useUser();
    const { isSignedIn } = useAuth();

    const [state, setState] = useState<BackendAuthState>(() => ({
        backendToken: getBackendToken(),
        isBackendReady: !!getBackendToken(),
        error: null,
    }));

    const syncWithBackend = useCallback(async (email: string, clerkUserId: string) => {
        // Use the Clerk userId as a deterministic password
        const password = `clerk_${clerkUserId}`;

        try {
            // Try signup first
            const signupRes = await api.post("/auth/signup", { email, password });
            const token = signupRes.data.data.token as string;
            setBackendToken(token);
            setState({ backendToken: token, isBackendReady: true, error: null });
        } catch (signupErr: unknown) {
            // If 409 (user exists), fall back to login
            const isConflict =
                signupErr &&
                typeof signupErr === "object" &&
                "response" in signupErr &&
                (signupErr as { response?: { status?: number } }).response?.status === 409;

            if (isConflict) {
                try {
                    const loginRes = await api.post("/auth/login", { email, password });
                    const token = loginRes.data.data.token as string;
                    setBackendToken(token);
                    setState({ backendToken: token, isBackendReady: true, error: null });
                } catch {
                    setState({
                        backendToken: null,
                        isBackendReady: false,
                        error: "Failed to login with backend",
                    });
                }
            } else {
                setState({
                    backendToken: null,
                    isBackendReady: false,
                    error: "Failed to register with backend",
                });
            }
        }
    }, []);

    useEffect(() => {
        if (!isUserLoaded) return;

        // User signed out — clear backend token
        if (!isSignedIn || !user) {
            clearBackendToken();
            // Use a timeout to avoid setting state during effect
            const timer = setTimeout(() => {
                setState({ backendToken: null, isBackendReady: false, error: null });
            }, 0);
            return () => clearTimeout(timer);
        }

        // If we already have a token, we're good
        if (getBackendToken()) {
            // Use a timeout to avoid setting state during effect
            const timer = setTimeout(() => {
                setState((prev) => ({ ...prev, isBackendReady: true }));
            }, 0);
            return () => clearTimeout(timer);
        }

        // Sync with backend
        const email = user.primaryEmailAddress?.emailAddress;
        if (email) {
            syncWithBackend(email, user.id);
        }
    }, [isUserLoaded, isSignedIn, user, syncWithBackend]);

    return (
        <BackendAuthContext.Provider value={state}>
            {children}
        </BackendAuthContext.Provider>
    );
}

/**
 * Access the backend auth state from any component.
 */
export function useBackendAuth() {
    return useContext(BackendAuthContext);
}