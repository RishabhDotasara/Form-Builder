import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/types/types";
import React, { useEffect } from "react";

export default function UserFacingMultipleType({
  question,
  onChange,
}: {
  question: Question;
  onChange: ( id: string, value: string)=>void;
}) {
    const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
    
  return (
    <RadioGroup required={question.required}>
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={`${question.id}-${index}`} onClick={(e)=>{
            onChange(question.id, option);
          }}/>

          <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
