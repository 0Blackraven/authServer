import { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}

export function Join() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [availabilityMessage, setAvailabilityMessage] = useState<string>("");

    const fetchUsernameAvailability = useCallback(async () => {
        if (username.length < 3) {
            setIsUsernameAvailable(null);
            setAvailabilityMessage("Username must be at least 3 characters.");
            return;
        }

        try {
            setAvailabilityMessage("Checking...");
            const response = await axios.get("http://localhost:8080/users/checkUsername", {
                params: {
                    username: username
                }
            });
            
            const available = response.data.isAvailable;
            setIsUsernameAvailable(available);
            setAvailabilityMessage(available ? "Available" : "Taken");
        
        } catch (e) {
            setIsUsernameAvailable(false);
            setAvailabilityMessage("Error checking availability.");
        }
    }, [username]);

    const debounceFetch = useMemo(() => {
        return debounce(fetchUsernameAvailability, 500);
    }, [fetchUsernameAvailability]);

    useEffect(() => {
        if (username) {
            debounceFetch();
        } else {
            setIsUsernameAvailable(null);
            setAvailabilityMessage("");
        }

        return () => {};
    }, [username, debounceFetch]);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isUsernameAvailable !== true) {
            alert("Please check username availability and ensure it is available.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/users/signup",
                {
                    username,
                    email,
                    password,
                    provider: "default"
                }
            );
            console.log(res.data);
        } catch (e) {
            console.log(e);
        }
    }, [username, email, password, isUsernameAvailable]);

    return(
        <div className="flex justify-center items-center">
            <form className="h-[300] w-[300] border-2 flex flex-col p-4 space-y-2" onSubmit={handleSubmit}>
                <input 
                    placeholder="enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <p className={`text-sm ${isUsernameAvailable === true ? 'text-green-600' : 'text-red-600'}`}>
                    {availabilityMessage}
                </p>
                <input 
                    placeholder="enter email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    placeholder="enter password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={isUsernameAvailable !== true}>Submit</button>
            </form>
        </div>
    )
}