import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function log(text:string)
{
  if (process.env.NODE_ENV === "development")
  {
    console.log(text)
  }
}