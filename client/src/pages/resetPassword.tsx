import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../../context";

export const ResetPassword = () => {
    const [passwordVisibility, setPasswordVisibility] = React.useState(false);
    const [code, setCode] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = React.useState(false);
    const [matchingPasswords, setMatchingPasswords] = React.useState(false);
    const navigate = useNavigate();
    const { setToken } = useToken();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const res = await axios.post("http://localhost:8080/users/resetPassword", {
                newPassword: newPassword,
                tempCode: code
            },
                {
                    withCredentials: true
                });

            if (res.status === 200) {
                setToken(res.data as string);
                alert("Password reset successful")
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

    return (
        <div className="flex justify-center items-center w-dvw h-dvh" style={{ userSelect: 'none' }}>
            <div className="flex flex-col z-10 shadow-xl rounded-xl px-2 shadow-blue-500/50 border-2 border-blue-200 lg:w-[30%]">
                <form className="flex flex-col p-10 justify-center items-center gap-6" onSubmit={handleSubmit}>
                    <text className="text-2xl font-bold">
                        Set a new password
                    </text>

                    <div>
                        <text className="text-xl">
                            Enter Code sent to your email
                        </text>
                        <Input
                            type="text"
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-12 border-2 border-gray-200 focus:border-[#22C55E] mt-2"
                            required
                        />
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <Label className="text-xl">Enter new Password</Label>
                        <div className="relative w-full">
                            <Input
                                type={passwordVisibility ? 'text' : 'password'}
                                className="w-full h-12 border-2 border-gray-200 focus:border-[#22C55E] "
                                onChange={(e) => setNewPassword(e.target.value)}
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
                    <div className="w-full flex flex-col gap-2">
                        <Label className="text-xl">Re Enter Password</Label>
                        <div className="relative w-full">
                            <Input
                                type={confirmPasswordVisibility ? 'text' : 'password'}
                                className="w-full h-12 border-2 border-gray-200 focus:border-[#22C55E] "
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => {
                                    (newPassword === confirmPassword) ? setMatchingPasswords(true) : setMatchingPasswords(false)
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {confirmPasswordVisibility ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" variant={"secondary"} className="mt-4 px-9 text-6sm font-bold border-2 border-blue-200 hover:bg-blue-200 hover:text-white" disabled={confirmPassword == "" || !matchingPasswords}>Reset</Button>
                </form>
            </div>
        </div>
    )
}   