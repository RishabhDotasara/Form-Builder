import { twMerge } from "tailwind-merge";

export function Small({ children, className }: { children: React.ReactNode, className?:string }) {
    return (
      <small className={twMerge("text-sm font-medium leading-none", className)}>
        {children}
      </small>
    )
  }
  