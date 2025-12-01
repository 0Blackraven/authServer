import { createContext, useState, useContext } from "react";
import type { PropsWithChildren } from "react";

interface TokenContextType {
    accessToken: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
}

const initialContextValue: TokenContextType = {
    accessToken: null,
    setToken: () => {},
    clearToken: () => {} 
};

const TokenContext = createContext<TokenContextType>(initialContextValue);

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({children}:PropsWithChildren) =>{
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const setToken = (token:string) =>{
        setAccessToken(token);
    }

    const clearToken = () =>{
        setAccessToken(null);
    }

    const contextValue = {
        accessToken,
        setToken,
        clearToken
    };

    return(
        <TokenContext.Provider value={contextValue}>
            {children}
        </TokenContext.Provider>
    )
}