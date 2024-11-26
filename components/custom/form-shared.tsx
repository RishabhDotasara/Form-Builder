import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/types/types";
import UserFacingTextType from "./questions/user-facing/textQuestion";
import UserFacingCheckBoxType from "./questions/user-facing/checkboxType";
import UserFacingMultipleType from "./questions/user-facing/multipleType";
import UserFacingImageType from "./questions/user-facing/imageUploadType";

interface FormQuestionProps {
  question: Question;
  onChange: (id: string, value: string) => void;
}

export function FormQuestion({ question, onChange }: FormQuestionProps) {

  return (
    <div className="mb-8 pb-4  ">
      <Label
        htmlFor={question.id}
        className="block text-md font-medium text-gray-700 mb-2"
      >
        {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {question.type === "text" && (
        <UserFacingTextType onChange={onChange} question={question}/>
      )}
      {question.type === "checkbox" && (
        <UserFacingCheckBoxType onChange={onChange} question={question}/>
      )}
      {question.type === "multipleChoice" && (
        <UserFacingMultipleType onChange={onChange} question={question}/>
      )}
      {question.type === "imageUpload" && (
        <UserFacingImageType onChange={onChange} question={question}/>
      )}
    </div>
  );
}
