import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/types/types";
import React, { useEffect } from "react";

export default function UserFacingMultipleType({
  question,
  ...rest
}: {
  question: Question;
}) {
  return (
    <RadioGroup
      required={question.required}
      // @ts-ignore
      onValueChange={rest.onChange}
      // @ts-ignore
      defaultValue={rest.value}
    >
      {question.options?.map((option, index) => (
        <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
        <FormControl>
          <RadioGroupItem value={option} />
        </FormControl>
        <FormLabel className="font-normal">
          {option}
        </FormLabel>
      </FormItem>
      ))}
    </RadioGroup>
  );
}
