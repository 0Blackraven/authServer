import { Navigate, Outlet } from "react-router-dom";
import { Authentication } from "./utils";

export const PrivateRoutes = async () =>{
    const result = await Authentication();
    return(
        (result)?<Outlet/>:<Navigate to="/login"/>
    )}