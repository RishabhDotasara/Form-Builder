import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Question } from "@/types/types";
import React from "react";

export default function UserFacingCheckBoxType({
  question,
  onChange,
}: {
  question: Question;
  onChange: (id:string, value:string) => void;
}) {
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  return (
    <div className="flex gap-2 flex-col">
      {question.options &&
        question.options?.map((option: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              required={question.required}
              id={`${question.id}-${index}`}
              checked={selectedOptions.includes(option)}
              onClick={()=>{
                  if(selectedOptions.includes(option)){
                      setSelectedOptions(selectedOptions.filter((opt)=>opt!==option))
                  }else{
                      setSelectedOptions([...selectedOptions, option])
                  }
                  onChange(question.id, selectedOptions.join(","))
              }}
            />
            <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
          </div>
        ))}
    </div>
  );
}
