// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    register: `${API_BASE_URL}/api/v1/register`,
    tokens: (name: string) => `${API_BASE_URL}/api/tokens/${name}`,
    analyze: `${API_BASE_URL}/api/analyze-sentiment`,
    history: `${API_BASE_URL}/api/history`,
    health: `${API_BASE_URL}/api/health`,
};
