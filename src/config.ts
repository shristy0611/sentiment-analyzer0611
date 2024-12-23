// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    register: `${API_BASE_URL}/register`,
    tokens: (name: string) => `${API_BASE_URL}/tokens/${name}`,
    analyze: `${API_BASE_URL}/analyze`,
    history: `${API_BASE_URL}/history`,
    health: `${API_BASE_URL}/health`,
};
