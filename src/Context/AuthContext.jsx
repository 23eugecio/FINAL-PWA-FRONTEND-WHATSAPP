import { useContext, createContext, useState, useEffect, useMemo } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
    const [currentToken, setCurrentToken] = useState(null);

    useEffect(() => {
        try {
            const token = sessionStorage.getItem('access_token');
            if (token) {
                setCurrentToken(token);
                setIsAuthenticatedUser(true);
            }
        } catch (error) {
            console.error('Error accessing session storage', error);
        }
    }, []);

    const login = (userId, token) => {
        try {
            sessionStorage.setItem('access_token', token);
            setCurrentToken(token);
            setIsAuthenticatedUser(true);
        } catch (error) {
            console.error('Error setting session storage', error);
        }
    };

    const logout = () => {
        try {
            sessionStorage.removeItem('access_token');
            setCurrentToken(null);
            setIsAuthenticatedUser(false);
        } catch (error) {
            console.error('Error removing session storage', error);
        }
    };

    const getAuthToken = () => currentToken;

    const value = useMemo(() => ({
        logout, 
        login,
        isAuthenticatedUser, 
        getAuthToken 
    }), [logout, login, isAuthenticatedUser, getAuthToken]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
