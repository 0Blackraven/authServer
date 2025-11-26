import { db } from "../drizzle/index.ts";
import type { User, UserProvider } from "../types.ts";
import { users, userProviders } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";


export const addUser = async (user:User, userProvider: UserProvider) =>{
    try{
        const sameUsername = await db.select().from(users).where(eq(users.username, user.username)).limit(1);
        if(sameUsername.length !== 0){
            throw new Error("USername is already taken");
        }
        const data = await db.select().from(users).where(eq(users.email, user.email)).limit(1);

        let userId:number;

        if(data.length === 0){
            return db.transaction(async (tx)=>{
                const newUser = await tx.insert(users).values(user).returning();

                if(!newUser){
                    tx.rollback();
                    console.log("error adding user");
                    throw new Error("Errored adding new user");
                }
                userId = newUser[0].userId;
                const newUserProvider = {...userProvider, userId: userId} as UserProvider
                const test = await tx.insert(userProviders).values(newUserProvider).returning();
                if(!test){
                    console.log("error adding user provider");
                }
                return newUser;
            })
        }else{
            userId = data[0].userId;
            const newUserProvider = {...userProvider, userId: userId} as UserProvider;
            const findUser = await db.select().from(userProviders).where(eq(userProviders.userId , userId));
            if(findUser.length === 0){
                await db.insert(userProviders).values(newUserProvider).returning();
            }else{
                const sameProviderNotFound = ():boolean =>{
                    return findUser.find((user)=>user.provider === userProvider.provider) === undefined
                }
                if(sameProviderNotFound()){
                    await db.insert(userProviders).values(newUserProvider).returning();
                }else{
                    throw new Error("User already Present");
                }
            }
            return data;
        }

    }catch(e){
        console.log("Errored while adding user", e);
        throw e;
    }
}

export const findUserUsingEmail = async (email: string, password: string) =>{
    try{
        const userFound = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if(userFound.length === 0){
            throw new Error("User not found");
        }
        if(userFound[0].password === password){
            return userFound[0];
        }else{
            throw new Error("Wrong Password");
        }
    }catch(e){
        console.error(e);
        throw e;
    }
}

export const findUserUsingEmailForPasswordReset = async (email: string) =>{
    try{
        const userFound = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if(userFound.length === 0){
            throw new Error("email not found");
        }
        return userFound[0];
    }catch(e){
        console.error(e);
        throw e;
    }
}

export const findUserUsingUsername = async (username: string, password: string) =>{
    try{
        const userFound = await db.select().from(users).where(eq(users.username, username)).limit(1);

        if(userFound.length === 0){
            throw new Error("User not found");
        }
        if(userFound[0].password === password){
            return userFound[0];
        }else{
            throw new Error("Wrong Password");
        }
    }catch(e){
        console.error(e);
        throw e;
    }
}

// export const findUserToken = async (username:string) =>{
//     const user = await db.select({refreshToken:users.refreshToken}).from(users).where(eq(users.username,username));
//     if(user.length === 0){
//         console.log("user not found");
//         return null
//     }
//     return user[0].refreshToken;
// }

export const resetPassword = async (username:string, newPassword:string):Promise<boolean> =>{
    try{
        const userUpdate = await db.update(users).set({password: newPassword}).where(eq(users.username, username)).returning();
        if(userUpdate.length === 0){
            return false;
        }
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}