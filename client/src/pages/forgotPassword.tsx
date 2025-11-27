import React from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { MoveLeft } from "lucide-react";

export const ForgotPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(emailRegex.test(email) === false){
            setEmailError("Please enter a valid email address");
            return;
        }
        if(email.trim() === ''){
            setEmailError("Email cannot be empty");
            return;
        }
        try{
            const res = await axios.post('http://localhost:8080/users/forgotPassword',
                {
                    email: email
                }
            )
        }catch(e){
            setError(e as string);
            return;
        }
        setSubmitted(true);
        return;

    }
    return (
        (!submitted)?(
            <div className="flex justify-center items-center w-dvw h-dvh" style={{ userSelect: 'none' }}>
            <div className="flex flex-col z-10 shadow-xl rounded-xl p-10 shadow-blue-500/50 border-2 border-blue-200">
                <form className="flex flex-col p-10 justify-center items-center gap-6" onSubmit={handleSubmit}>
                    <text className="text-2xl">
                        Get a mail to reset your password
                    </text>

                    <div className="w-full flex flex-col gap-2">
                        <Label className="text-xl">
                            Enter registered mail ID:
                        </Label>
                        <Input onChange={(e)=> setEmail(e.target.value)} className="w-full border-2 " />
                        {emailError !== " " &&  <text className="text-sm text-red-500">{emailError}</text>}
                    </div>

                    <Button type="submit" variant={"secondary"} className="mt-4 px-9 text-6sm font-bold border-2 border-blue-200 hover:bg-blue-200 hover:text-white">Send Mail</Button>
                </form>
            </div>
        </div>
        ):(
            <div className="flex justify-center items-center w-dvw h-dvh" style={{ userSelect: 'none' }}>
            <div className="flex flex-col z-10 shadow-xl rounded-xl p-10 shadow-blue-500/50 border-2 border-blue-200">
                <form className="flex flex-col p-10 justify-center items-center gap-6">
                    {error === "" ? (
                        <text className="text-3xl">
                            Check your mail for reset link!
                        </text>
                    )
                    :(
                        <text className="text-3xl text-red-300">
                            {error}
                        </text>
                    )}
                    <Button variant={"ghost"} onClick={()=>setSubmitted(false)}><MoveLeft/></Button>
                </form>
            </div>
        </div>
        )
    )
}