// import react from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

export function Header() {

    return (
        <div className="flex flex-row justify-between">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <h1>Analytic DashBoard</h1>

        </div>
    )
}