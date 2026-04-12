/**
 * Centralized API configuration for ALS-LBS.
 * In production (Vercel), VITE_API_URL should be set in the environment variables.
 * In development, it defaults to /api which is proxied by Vite to http://65.2.10.210:5000/api.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    TASKS: {
        BASE: `${API_BASE_URL}/tasks`,
        BY_ID: (id: string) => `${API_BASE_URL}/tasks/${id}`,
    },
    STABILITY: {
        BASE: `${API_BASE_URL}/stability`,
        HISTORICAL: `${API_BASE_URL}/stability/historical`,
        DAILY: `${API_BASE_URL}/stability/daily`,
    },
    HEALTH: `${API_BASE_URL}/health`,
};
