import { createHash } from "crypto";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type {User, UserProvider} from "../types.ts"
import { 
  addUser, 
  findUserUsingEmailForPasswordReset, 
  findUserUsingUsername, 
  resetPassword 
} from "../services/userAuthServices.ts";
import { client } from "../redis/index.ts"
import { sendMail } from "../kafka/producer.ts";

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const accessKey = process.env.ACCESS_KEY;
const refreshKey = process.env.REFRESH_KEY;
if(!secretKey || !accessKey || !refreshKey){
  throw new Error("Secret keys are not set in environment variables");
}
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  return jwt.sign({ username: username }, accessKey, {expiresIn: "30mins"});
};

const createRefreshToken = (username: string): string => {
  return jwt.sign({ username: username }, refreshKey, {expiresIn: "7d"});
}

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
    return res.status(400).json("Sorry Username Taken");
  }

  const generatedPass = passwordHasher(password); 
  const generatedRefreshToken = createRefreshToken(username);
  if(generatedRefreshToken === undefined){
    return res.status(500).json("sorry try again later")
  }
  const token = generatedRefreshToken;

  const User = {
    email: email,
    username: username,
    password: generatedPass,
  } as User;


  const UserProvider = {
    provider: provider,
  } as UserProvider;
  try{
    // const sessionInfo = JSON.stringify({username,email});
    const access = createAccessToken(username);
    await client.bf.add('mybloom',username);
    await addUser(User, UserProvider)
    await client.set(`refreshToken${username}`, token, {EX: 7*24*60*60});
    res.cookie('refreshToken',token,{
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7*24*60*60*1000,
      path: '/'
    });
    return res.status(200).json(access);
  }catch(e){
    return res.status(500).json(`${e}`);
  }
};

export const loginHandler = async (req:Request, res:Response) =>{
  const {email, password} : {email: string , password: string} = req.body as {
    email : string, password: string
  };
  const emailOrUsername = email;
  const hashedPassword = passwordHasher(password);
  const access = createAccessToken(emailOrUsername);
  let refresh = await client.get(`refreshToken${emailOrUsername}`);
  if(refresh === null){
    refresh = createRefreshToken(emailOrUsername);
    await client.set(`refreshToken${emailOrUsername}`, refresh, {EX: 7*24*60*60});
  }

  if(!hashedPassword){
    return res.status(300).json("add password");
  }
  try{
      console.log(emailOrUsername);
      const user = await findUserUsingUsername(emailOrUsername, hashedPassword);
      console.log(user);
      res.cookie('refreshToken',refresh,{
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7*24*60*60*1000,
        path: '/'
      });
      return res.status(200).json(access);
  }catch(e){
    return res.status(500).json("Something went wrong in our side");
  }
}

export const sendTempCodeHandler = async (req:Request, res:Response) =>{
  const {email}:{email:string} = req.body as {email:string};
  try{
    const user = await findUserUsingEmailForPasswordReset(email);
    const tempCode = createTempCode();
    const hash = createHash("sha256").update(tempCode + secretKey).digest("base64");
    client.set(tempCode, user.username, {EX: 5*60});
    // console.log(`Temp code for ${email} is ${tempCode}`);
    sendMail(email, tempCode, hash);
    return res.status(200).json("Temp code has been sent to your email valid for 5 minutes");

  }catch(e){
    console.error(e);
    return res.status(500).json("Something went wrong in our side");
  }
}

export const resetPasswordHandler = async (req:Request, res:Response) =>{
  const {newPassword,tempCode}:{newPassword:string,tempCode:string} = req.body as {newPassword:string, tempCode:string};
  
  try{
    if(!newPassword || !tempCode){
      return res.status(400).json("New password or temp code missing");
    }
    const username = await client.get(tempCode);
    if(!username){
      return res.status(400).json("Invalid or expired temp code");
    }
    const result:boolean = await resetPassword(username, passwordHasher(newPassword) as string);
    if(result){
      client.del(tempCode);
      client.del(`refreshToken${username}`);
      const access = createAccessToken(username);
      const refresh = createRefreshToken(username);
      await client.set(`refreshToken${username}`, refresh, {EX: 7*24*60*60});
      res.cookie('refreshToken',refresh,{
        httpOnly: true,
        sameSite: 'none',
        maxAge: 7*24*60*60*1000,
        path: '/'
      });
      return res.status(200).json(access);
    }else{
      return res.status(500).json("Failed to reset password");
    }
  }catch(e){
    console.error(e);
    return res.status(500).json("Something went wrong in our side");
  }
}

export const getTokenHandler = async (req:Request, res:Response) =>{
  const refreshToken = req.cookies.refreshToken;
  // console.log("Cookies:", req.cookies); 
  // console.log("RefreshToken:", refreshToken);
  if(!refreshToken){
    return res.status(401).json({message:"No refresh token found, please login again"});
  }
  try{
    const decode = jwt.verify(refreshToken,refreshKey);
    if(typeof decode === 'string'){
      return res.status(500).json("sorry");
    }
    const {username} = decode;
    const storedToken = await client.get(`refreshToken${username}`);
    if(storedToken !== refreshToken){
      return res.status(403).json("session invalid");
    }
    const access = createAccessToken(username);
    return res.status(200).json(access);
  }catch(e){
    return res.status(500).json("u broke the server asshole");
  }
}