import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Question } from "@/types/types";
import React from "react";

export default function UserFacingCheckBoxType({
  question,
  form,
  ...rest
}: {
  question: Question;
  form:any
}) {
  return (
    <div className="flex gap-2 flex-col">
      {question.options &&
        question.options?.map((option: string, index: number) => (
          <FormField
            key={index}
            control={form.control}
            name="items"
            render={({ field }) => {
              return (
                <FormItem
                  key={index}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(index)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, index])
                          : field.onChange(
                              field.value?.filter((value) => value !== index)
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{option}</FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
    </div>
  );
}
