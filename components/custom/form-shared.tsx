import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { keywords, Question } from "@/types/types";
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
      {(keywords.text.includes(question.type)) && (
        <UserFacingTextType onChange={onChange} question={question}/>
      )}
      {keywords.checkbox.includes(question.type) && (
        <UserFacingCheckBoxType onChange={onChange} question={question}/>
      )}
      {keywords.multipleChoice.includes(question.type) && (
        <UserFacingMultipleType onChange={onChange} question={question}/>
      )}
      {keywords.imageUpload.includes(question.type) && (
        <UserFacingImageType onChange={onChange} question={question}/>
      )}
    </div>
  );
}
