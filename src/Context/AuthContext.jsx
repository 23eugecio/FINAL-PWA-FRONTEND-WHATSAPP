import { useContext, createContext, useState, useEffect } from "react";



export const AuthContext = createContext()


export const AuthContextProvider = ({ children }) => {
    const access_token = sessionStorage.getItem('access_token')
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(
        Boolean(access_token)
    )

    useEffect(() => {
        const access_token = sessionStorage.getItem("access_token");
        if (access_token) {
            setIsAuthenticatedUser(true);
        }
    }, [access_token]);

    const logout = () => {
        sessionStorage.removeItem('access_token')
        setIsAuthenticatedUser(false)
    }

    return (
        <AuthContext.Provider value={{
            logout,
            isAuthenticatedUser,
            setIsAuthenticatedUser
        }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext)
}



