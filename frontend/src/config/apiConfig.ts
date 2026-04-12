const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://65.2.10.210:5000';

const API_ENDPOINTS = {
    BASE_URL: API_BASE_URL,
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        PROFILE: '/api/auth/profile',
    },
    TASKS: {
        BASE: '/api/tasks',
        BY_ID: (id: string) => `/api/tasks/${id}`,
    },
    STABILITY: {
        BASE: '/api/stability',
        HISTORICAL: '/api/stability/historical',
        DAILY: '/api/stability/daily',
    },
    HEALTH: '/api/health',
    CHAT: '/api/chat',
};

export default API_ENDPOINTS;
