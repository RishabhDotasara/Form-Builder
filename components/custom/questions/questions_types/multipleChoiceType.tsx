import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

export default function MultipleChoiceType({
  isEditing,
  options,
  questionId,
  updateQuestion
}: {
  isEditing: Boolean;
  options: string[] | undefined ;
  questionId: string;
  updateQuestion:()=>void
}) {
  return (
    <RadioGroup className="space-y-2 mt-2">
      {options?.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option}
            id={`${questionId}-${index}`}
            disabled={true}
          />
          {isEditing ? (
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...(options || [])];
                newOptions[index] = e.target.value;
                // @ts-ignore
                updateQuestion(questionId, { options: newOptions });
              }}
              className="flex-grow"
            />
          ) : (
            <Label htmlFor={`${questionId}-${index}`}>{option}</Label>
          )}
        </div>
      ))}
      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            // @ts-ignore
            updateQuestion(questionId, {
              options: [...(options || []), "New Option"],
            })
          }
        >
          Add Option
        </Button>
      )}
    </RadioGroup>
  );
}
