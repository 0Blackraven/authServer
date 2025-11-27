import { useState, useCallback} from "react";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from "axios";

export function Join() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
    const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
    const textColour = isUsernameAvailable? "text-green-500" : "text-red-500";

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

    const blurHandler = useCallback(()=>{
        console.log("fetchUsername called");
        fetchUsernameAvailability()
    },[username])

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
        } catch (e) {
            console.log(e);
        }
    }, [username, email, password, isUsernameAvailable]);

    return(
        <div className="flex justify-center items-center w-dvw h-dvh" style={{userSelect: 'none'}}>
            <div className="flex z-10 shadow-xl rounded-2xl px-7 py-10 shadow-blue-500/50 w-[30%] border-blue-200 border-2">
                <form className="w-full flex flex-col gap-10 items-center" onSubmit={(e) => handleSubmit(e)}>
                    <text className="text-2xl">Welcome </text>
                    <div className="w-full flex flex-col gap-3">
                        <Label>Enter Username</Label>
                        <Input onChange={(e) => setUsername(e.target.value)} onBlur={fetchUsernameAvailability} className="h-12 border-2"></Input>
                        <p className={`text-sm text-${textColour}`} >{availabilityMessage}</p>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                        <Label>Enter Email</Label>
                        <Input onChange={(e) => setEmail(e.target.value)} className="h-12 border-2"></Input>
                    </div>
                    <div className=" w-full flex flex-col gap-3">
                        <Label>Enter Password</Label>
                        <div className="w-full flex flex-col">
                            <div className="relative w-full">
                            <Input
                                type={passwordVisibility ? 'text' : 'password'}
                                className="w-full h-12 border-2 border-gray-200 focus:border-[#22C55E] "
                                onChange={(e)=> setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {passwordVisibility ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        </div>
                    </div>
                    
                    <Button type="submit" variant={"secondary"} className="px-9 text-6sm font-bold border-2 border-blue-200 hover:bg-blue-200 hover:text-white">Submit</Button>
                </form>
            </div>
        </div>
    )
}