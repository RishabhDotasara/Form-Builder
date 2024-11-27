import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/types/types";
import React from "react";

export default function UserFacingTextType({onChange, question}:{onChange:(id:string, value:string)=>void, question:Question}) {
  return (
        <Textarea
          placeholder="Enter your answer"
          className="w-full mt-2"
          required={question.required}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
  );
}
