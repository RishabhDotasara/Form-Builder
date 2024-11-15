import { twMerge } from "tailwind-merge";

export function Large({ children, className }: { children: React.ReactNode, className?:string }) {
    return <div className={twMerge("text-md")}>{children}</div>
  }
  