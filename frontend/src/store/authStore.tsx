import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Hydrate from localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && typeof parsedUser === 'object') {
                    setToken(storedToken);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = useCallback((newToken: string, userData: any) => {
        // Map _id to id if necessary
        const userWithId = {
            ...userData,
            id: userData.id || userData._id
        };
        setToken(newToken);
        setUser(userWithId);
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userWithId));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthStore = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthStore must be used within an AuthProvider');
    }
    return context;
};
