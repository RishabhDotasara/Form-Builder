import { clsx, type ClassValue } from "clsx";
import Groq from "groq-sdk";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function log(text: any) {
  if (process.env.NODE_ENV === "development") {
    console.log(text);
  }
}


