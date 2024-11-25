import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function CheckBoxType({
  isEditing,
  options,
  questionId,
  updateQuestion,
  
}: {
  isEditing: Boolean;
  options: string[] | undefined;
  questionId: string;
  updateQuestion: ()=>void
}) {
  return (
    <div className="space-y-2 mt-2">
      {options &&
        options?.map((option: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox id={`${questionId}-${index}`} disabled={!isEditing} />
            {isEditing ? (
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...(options || [])];
                  newOptions[index] = e.target.value;
                //   @ts-ignores
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
          className="w-full"
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

    </div>
  );
}
