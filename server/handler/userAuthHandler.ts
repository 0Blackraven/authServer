import { createHash } from "crypto";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type {User, UserProvider} from "../types.ts"
import { addUser, findUserUsingEmail, findUserUsingEmailForPasswordReset, findUserUsingUsername, resetPassword } from "../services/userAuthServices.ts";
import { client } from "../redis/index.ts"

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const accessKey = process.env.ACCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createTempCode = (): string =>{
  return (Math.floor(Math.random() * 9999) + 10001).toString();
}

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
  return jwt.sign({ username: username }, accessKey, {expiresIn: "30mins"});
};

const createRefreshToken = (username: string): {token:string, randomNumber:string}|string => {
  if (!refreshKey) {
    return "Cannot create session token due to env error";
  }
  const randomStuff:string = Math.floor(Math.random()*(1000000-1000+1)).toString();
  return {
    token: createHash("sha256").update(refreshKey+username+randomStuff).digest("base64"),
    randomNumber: randomStuff
  }
  
};

export const checkUsernameAvailability = async(req:Request, res:Response) =>{
  const {username} = req.query as {username:string}
  const response = await client.bf.exists('mybloom', username);
  return res.status(200).json({isAvailable: !response});
}

export const verifyUser = async (req:Request, res:Response) =>{
  const {token,username}:{token:string,username:string} = req.body as {token:string,username:string}
  try{
    // const storedToken = await findUserToken(username);
    const storedToken = await client.get(`refreshToken-${username}`);
    if(storedToken === null){
      return res.status(400).json("Try login")
    }
    const givenToken = createHash("sha256").update(refreshKey+username+token).digest("base64");
    if(givenToken !== storedToken){
      return res.status(400).json("Try login again")
    }
    return res.status(200).json("Welcome")

  }catch(e){
    console.error(e);
    return res.status(500).json("Sorry something went wrong");
  }
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
    return res.status(400).json("Sorry Username Taken");
  }

  const generatedPass = passwordHasher(password); 
  const generatedRefreshToken = createRefreshToken(username);
  if(typeof generatedRefreshToken === "string"){
    return res.status(500).json("sorry failed to generate tokens")
  }
  const {token, randomNumber} = generatedRefreshToken;

  
  const User = {
    email: email,
    username: username,
    password: generatedPass,
  } as User;


  const UserProvider = {
    provider: provider,
  } as UserProvider;
  try{
    const sessionInfo = JSON.stringify({username,email});
    const access = createAccessToken(username);
    await client.set(access,sessionInfo,{EX:30*60});
    await client.bf.add('mybloom',username);
    await addUser(User, UserProvider)
    await client.set(`refreshToken-${username}`, token, {EX: 7*24*60*60});
    return res.status(200).json({access,randomNumber});
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

export const sendTempCodeHandler = async (req:Request, res:Response) =>{
  const {email}:{email:string} = req.body as {email:string};
  try{
    const user = await findUserUsingEmailForPasswordReset(email);
    const tempCode = createTempCode();
    client.set(tempCode, user.username, {EX: 5*60});
    // send email for code logic here and redirect the user to a page where they enter the code and new password
    return res.status(200).json("Temp code has been sent to your email valid for 5 minutes");

  }catch(e){
    console.error(e);
    return res.status(500).json("Something went wrong in our side");
  }
}

export const resetPasswordHandler = async (req:Request, res:Response) =>{
  const {newPassword}:{newPassword:string} = req.body as {newPassword:string};
  const {tempCode}:{tempCode:string} = req.params as {tempCode:string};
  
  try{
    const username = await client.get(tempCode);
    if(!username){
      return res.status(400).json("Invalid or expired temp code");
    }
    const result:boolean = await resetPassword(username, passwordHasher(newPassword) as string);
    if(result){
      client.del(tempCode);
      return res.status(200).json("Password reset successful");
    }else{
      return res.status(500).json("Failed to reset password");
    }
  }catch(e){
    console.error(e);
    return res.status(500).json("Something went wrong in our side");
  }
}