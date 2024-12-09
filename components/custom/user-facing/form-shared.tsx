import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { keywords, Question } from "@/types/types";
import UserFacingTextType from "../questions/user-facing/textQuestion";
import UserFacingCheckBoxType from "../questions/user-facing/checkboxType";
import UserFacingMultipleType from "../questions/user-facing/multipleType";
import UserFacingImageType from "../questions/user-facing/imageUploadType";

interface FormQuestionProps {
  question: Question;
  form:any
}

export function FormQuestion({ question,form ,  ...rest}: FormQuestionProps) {

  return (
    <div>
    

      {(keywords.text.includes(question.type)) && (
        <UserFacingTextType question={question} {...rest}/>
      )}
      {/* {keywords.checkbox.includes(question.type) && (
        <UserFacingCheckBoxType  question={question} {...rest} form={form}/>
      )} */}
      {keywords.multipleChoice.includes(question.type) && (
        <UserFacingMultipleType  question={question} {...rest} />
      )}
      {keywords.imageUpload.includes(question.type) && (
        <UserFacingImageType question={question} {...rest}/>
      )}
    </div>
  );
}
