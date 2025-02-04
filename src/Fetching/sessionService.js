import ENVIRONMENT from '../environment.js';

const sessionService = {
    getSession: async (token) => {
        const response = await fetch(`${ENVIRONMENT.URL_BACK}/api/auth/session`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Session verification failed');
        }

        return response.json();
    },

    createSession: async (userId, token) => {
        const response = await fetch(`${ENVIRONMENT.URL_BACK}/api/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, token })
        });

        if (!response.ok) {
            throw new Error('Failed to create session');
        }

        return response.json();
    },

    deleteSession: async (token) => {
        const response = await fetch(`${ENVIRONMENT.URL_BACK}/api/auth/session`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete session');
        }

        return response.json();
    }
};

export default sessionService;

