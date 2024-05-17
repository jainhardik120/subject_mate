"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

type SignerContextType = {
    token?: string;
    setToken: (token: string) => void;
}

const SignerContext = createContext<SignerContextType>({} as any);

const useSigner = () => useContext(SignerContext);

export const SignerProvider = ({ children }: { children: ReactNode }) => {
    const [token, setTokenState] = useState(() => {
        return window.localStorage.getItem('token') || '';
    });

    const setToken = (newToken: string) => {
        setTokenState(newToken);
        window.localStorage.setItem('token', newToken);
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const newToken = window.localStorage.getItem('token') || '';
            setTokenState(newToken);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const contextValue = { token, setToken };
    return (
        <SignerContext.Provider value={contextValue}>
            {children}
        </SignerContext.Provider>
    );
}

export default useSigner;
