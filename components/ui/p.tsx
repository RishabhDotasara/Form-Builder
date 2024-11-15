import { twMerge } from "tailwind-merge";

export function P({ children, className }: { children: React.ReactNode, className?:string }) {
    return (
      <p className={twMerge("leading-7 [&:not(:first-child)]:mt-6", className)}>
        {children}
      </p>
    )
  }
  