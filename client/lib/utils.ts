import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios, { AxiosResponse } from 'axios'
import { useToken } from '../context'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTokenHandler = async():Promise<string|undefined> =>{
  try{
      const response = await axios.get("http://localhost:8080/users/getToken",{
        withCredentials: true
      });
      console.log("i am not here");
      console.log(response.status)
      console.log(response.data)
      if(response.status === 200){
        return response.data
      }
    }catch(e){
      // if(axios.isAxiosError(e) && e.response){
      //   alert(e.response.data.message);
      // }else{
      //   alert("Something went wrong");
      // }
      console.log("i am here");
      return undefined;
    }
}

