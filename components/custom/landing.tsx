import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { H3 } from "../ui/h3";
import { H1 } from "../ui/h1";
import { H4 } from "../ui/h4";
import { Button } from "../ui/button";
import { ArrowDown } from "lucide-react";

export function LandingPage() {
  return (
    <>
    
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 bg-background gap-4 text-foreground ">
        <H1>Forms Made <span className="text-primary">Easy</span> with <span className="text-primary">AI</span></H1>
        <H4 className="text-muted-foreground">
          Let AI Handle the Heavy Lifting<br/>
        </H4>
      </BackgroundLines>
      
    </>
  );
}
