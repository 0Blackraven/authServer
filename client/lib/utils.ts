import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios, { AxiosResponse } from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Authentication = async (): Promise<boolean> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  try {
    const response: AxiosResponse = await axios({
      method: "post",
      url: "/verification",
      data: {
        token: token
      }
    });
    return response.status === 200;
  } catch (e) {
    console.log(e);
    return false;
  }
}
