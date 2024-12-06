import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/types/types";
import React from "react";

export default function UserFacingTextType({
  question,
  ...rest
}: {
  question: Question;
}) {
  return (
    <Textarea
      placeholder="Enter your answer"
      className="w-full mt-2"
      {...rest}
    />
  );
}
