import { ENVIRONMENT } from "../environment";

// Configuración del Backend URL
const API_BASE_URL = ENVIRONMENT.URL_BACK;

// Función para obtener headers no autenticados
export const getUnnauthenticatedHeaders = () => {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('x-api-key', '54fb6c44-8480-4351-b85f-3611d012356d');
    return headers;
};

// Función para obtener headers autenticados
export const getAuthenticatedHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
        console.error('Authentication token is missing');
        return getUnnauthenticatedHeaders(); // Devolver encabezados no autenticados si no hay token
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('x-api-key', '54fb6c44-8480-4351-b85f-3611d012356d');
    headers.set('Authorization', 'Bearer ' + token);

    return headers;
};

// Función genérica para manejar solicitudes HTTP
const httpRequest = async (url, method, options = {}) => {
    try {
        const response = await fetch(url, {
            method,
            ...options
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `${method} request failed`);
        }

        return data;
    } catch (error) {
        console.error(`${method} request error:`, error);
        throw error;
    }
};

// Funciones específicas para cada método HTTP

export const POST = async (endpoint, body, auth = false) => {
    const headers = auth ? getAuthenticatedHeaders() : getUnnauthenticatedHeaders();
    return await httpRequest(`${API_BASE_URL}${endpoint}`, 'POST', {
        headers,
        body: JSON.stringify(body)
    });
};

export const GET = async (endpoint, auth = false) => {
    const headers = auth ? getAuthenticatedHeaders() : getUnnauthenticatedHeaders();
    return await httpRequest(`${API_BASE_URL}${endpoint}`, 'GET', { headers });
};

export const PUT = async (endpoint, body, auth = false) => {
    const headers = auth ? getAuthenticatedHeaders() : getUnnauthenticatedHeaders();
    return await httpRequest(`${API_BASE_URL}${endpoint}`, 'PUT', {
        headers,
        body: JSON.stringify(body)
    });
};

export const DELETE = async (endpoint, auth = false) => {
    const headers = auth ? getAuthenticatedHeaders() : getUnnauthenticatedHeaders();
    return await httpRequest(`${API_BASE_URL}${endpoint}`, 'DELETE', { headers });
};

// Función para crear un cliente HTTP con autenticación
export const createHttpClient = (authContext) => {
    const GET = async (url) => {
        const token = authContext.getAuthToken();
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    await authContext.logout();  // Manejar expiración de sesión
                }
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText);
            }

            return await response.json();
        } catch (error) {
            console.error('GET request error:', error);
            throw error;
        }
    };

    return { GET };
};
