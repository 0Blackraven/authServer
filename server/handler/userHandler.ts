import { createHash } from "crypto";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type {User, UserProvider} from "../types.ts"
import { addUser, findUserUsingEmail, findUserUsingUsername } from "../services/userServices.ts";
import { client } from "../redis/index.ts"

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const accessKey = process.env.ACCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordHasher = (password: string|undefined) => {
  if(password === undefined){
    return;
  }
  return createHash("sha256")
    .update(password + secretKey)
    .digest("base64");
};

const createAccessToken = (username: string): string => {
  if (!accessKey) {
    return "Cannot create session token du to env error";
  }
  return jwt.sign({ username: username }, accessKey, { expiresIn: "1day" });
};

const createRefreshToken = (username: string): string => {
  if (!refreshKey) {
    return "Cannot create session token du to env error";
  }
  return jwt.sign({ username: username }, refreshKey, {
    expiresIn: "30day",
  });
};

export const checkUsernameAvailability = async(req:Request, res:Response) =>{
  const {username} = req.query as {username:string}
  const response = await client.bf.exists('mybloom', username);
  return res.status(200).json({isAvailable: !response});
}

export const signupHandler = async (req: Request, res: Response) => {

  const {
    email,
    username,
    password,
    provider,
  }: { email: string; username: string; password: string; provider: "default"|"google"|"github"} = req.body as {
    email: string;
    username: string;
    password: string;
    provider: "default"|"google"|"github";
  };

  if(!email || !username){
    return res.status(400).json("Email or username could not be procured ");
  }
  if(await client.bf.exists('mybloom',username)){
    throw new Error("Try a different username please");
  }
  const generatedUsername = username;
  const generatedPass = passwordHasher(password);
  const generatedRefreshToken = createRefreshToken(generatedUsername);
  const generatedProviderId = (provider === "default")?"01234":"98765";

  const User = {
    email: email,
    username: generatedUsername,
    password: generatedPass,
    refreshToken: generatedRefreshToken,
  } as User;


  const UserProvider = {
    provider: provider,
    providerRefId: generatedProviderId
  } as UserProvider;
  try{
    const sessionInfo = JSON.stringify({username,email});
    const access = await client.set(createAccessToken(username),sessionInfo,{EX:3*3600});// expiry after 10 hrs
    await client.bf.add('mybloom',username);
    await addUser(User, UserProvider)
    return res.status(200).json(access);
  }catch(e){
    return res.status(500).json(`${e}`);
  }
};

export const loginHandler = async (req:Request, res:Response) =>{
  const {emailOrUsername, password} : {emailOrUsername: string , password: string} = req.body as {
    emailOrUsername : string, password: string
  };

  const IsEmail = (emailOrUsername:string):boolean =>{
    return emailRegex.test(emailOrUsername);
  }

  const hashedPassword = passwordHasher(password);
  if(!hashedPassword){
    return res.status(300).json("add password");
  }
  try{
    if(IsEmail(emailOrUsername)){
      return res.status(200).json(await findUserUsingEmail(emailOrUsername, hashedPassword));
    }else{
      return res.status(200).json(await findUserUsingUsername(emailOrUsername, hashedPassword));
    }
  }catch(e){
    return res.status(500).json("Something went wrong in our side");
  }
}