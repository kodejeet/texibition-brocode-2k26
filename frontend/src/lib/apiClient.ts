import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const TOKEN_KEY = "subtrack_backend_token";

/**
 * Get the stored backend JWT token.
 */
export function getBackendToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store the backend JWT token.
 */
export function setBackendToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Clear the backend JWT token (on sign-out).
 */
export function clearBackendToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Pre-configured Axios instance that points at the backend API
 * and automatically attaches the auth token.
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach token to every request
api.interceptors.request.use((config) => {
    const token = getBackendToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
