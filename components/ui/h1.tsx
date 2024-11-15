import { twMerge } from "tailwind-merge";

export function H1({ children, className }: { children: React.ReactNode, className?:string }) {
    return (
      <h1 className={twMerge("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
        {children}
      </h1>
    )
  }
  