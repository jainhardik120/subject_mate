'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

type SignerContextType = {
    token? : string;
    setToken: (token: string) => void;
}

const SignerContext = createContext<SignerContextType>({} as any);

const useSigner = () => useContext(SignerContext);


export const SignerProvider = ({ children }: { children: ReactNode }) => {
    const [token ,setToken ] = useState("");
    const contextValue = { token, setToken };
    return (
		<SignerContext.Provider value = {contextValue}>
        {children}
        </SignerContext.Provider>
	);
}

export default useSigner;