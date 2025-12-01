import { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../context";

export function Login() {
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const { setToken } = useToken();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log(email, password)
            const res = await axios.post("http://localhost:8080/users/login",
                {
                    email: email,
                    password: password
                },
                {
                    withCredentials: true
                }
            )
            if (res.status === 200) {
                // alert("Login Successful");
                console.log(res.data);
                setToken(res.data as string);
                navigate("/superSecret");
            }
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                alert(e.response.data as string);
            } else {
                alert("Something went wrong");
            }
        }
    }

    const handleForgotPassword = () => {
        navigate("/forgotPassword");
    }

    return (
        <div className="flex justify-center items-center w-dvw h-dvh" style={{ userSelect: 'none' }}>
            <div className="flex z-10 shadow-xl rounded-2xl px-7 py-10 shadow-blue-500/50 w-[30%] border-blue-200 border-2">
                <form className="w-full flex flex-col gap-10 items-center" onSubmit={(e) => handleSubmit(e)}>
                    <text className="text-2xl">Welcome Back</text>
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
                                    onChange={(e) => setPassword(e.target.value)}
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
                            <div className="text-sm hover:cursor-pointer ml-auto pt-2 px-2 hover:text-blue-400" onClick={handleForgotPassword}>Forgot Password</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button type="submit" variant={"secondary"} className="px-9 text-6sm font-bold border-2 border-blue-200 hover:bg-blue-200 hover:text-white">Submit</Button>
                        <span className="text-sm">Don't have an account? <a href="/join" className="text-blue-500 hover:underline">Join</a></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

