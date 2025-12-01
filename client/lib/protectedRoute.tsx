import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTokenHandler } from "./utils";
import { useToken } from "../context";

export const PrivateRoutes = () => {
    const { accessToken, setToken } = useToken();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Step 1: Check if accessToken exists in context
            if (accessToken) {
                console.log("got access token in the state only")
                setIsAuthenticated(true);
                setLoading(false);
                return;
            }

            // Step 2: No accessToken, try to get one using refreshToken (from cookie)
            try {
                const token = await getTokenHandler();
                console.log(token+'token')
                if (typeof token === 'string' && token.length > 0) {
                    // Successfully got new accessToken from refreshToken
                    setToken(token);
                    setIsAuthenticated(true);
                } else {
                    // No refreshToken or invalid, user needs to login
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // Failed to get token, user needs to login
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [accessToken, setToken]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-dvw h-dvh">
                <div>Loading...</div>
            </div>
        );
    }
    console.log(isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
