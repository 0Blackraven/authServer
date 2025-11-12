import { useState } from "react";
import axios from "axios";

export function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:8080/users/login",
                {
                    email: email,
                    password: password
                }
            )
            console.log(res.data);
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className="flex justify-center items-center">
            <form className="h-[300] w-[300] border-2" onSubmit={(e) => handleSubmit(e)}>
                <input placeholder="enter email" onChange={(e) => setEmail(e.target.value)}></input>
                <input placeholder="enter password" onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}