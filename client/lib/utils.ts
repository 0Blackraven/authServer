import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios, { AxiosResponse } from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Authentication = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token) {
    return false;
  }
  if (!username){
    return false;
  }
  try {
    const response: AxiosResponse = await axios.post(
      "http://localhost:8080/users/verification",
      {
        token: token,
        username: username
      }
    );
    return response.status === 200;
  } catch (e) {
    console.log(e);
    return false;
  }
}
