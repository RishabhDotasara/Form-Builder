// This should have the question title, which will be common for all of the question types, but the question body will be different.

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import TextType from "./questions_types/text";
import CheckBoxType from "./questions_types/checkbox";
import ImageUploadType from "./questions_types/imageUpload";
import MultipleChoiceType from "./questions_types/multipleChoiceType";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Question } from "@/types/types";
import { SelectValue } from "@radix-ui/react-select";



export default function QuestionBlock({
  question,
  editingQuestionId,
  setEditingQuestionId,
  updateQuestion,
  deleteQuestion,
}: {
  question?: Question;
  editingQuestionId?: string;
  setEditingQuestionId?: () => void;
  updateQuestion?: () => void;
  deleteQuestion?: () => void;
}) {
  const isEditing = editingQuestionId === question.id;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 p-4 bg-white rounded-lg shadow w-full"
    >
      {/* Question heading part */}
      <div className="flex justify-between items-center mb-2">
        {isEditing ? (
          <div className="flex justify-between w-full gap-2 mr-2">
            <Input
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, { question: e.target.value })
              }
              className="font-bold text-lg "
            />
            <Select onValueChange={(value:string)=>updateQuestion(question?.id, {required:value==="r" ? true : false})} value={question?.required ? "r" : "nr"}>
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Required"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="r"><span className="text-red-500">*</span></SelectItem>
                <SelectItem value="nr">*</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <h3 className="font-bold text-lg">
            {question?.question}
            {question?.required && <span className="text-red-500 ml-2">*</span>}
          </h3>
        )}
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingQuestionId(isEditing ? null : question.id)}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteQuestion(question.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Question Body Part */}
      {question?.type === "text" && <TextType isEditing={isEditing} />}
      {question?.type === "checkbox" && (
        <CheckBoxType
          isEditing={isEditing}
          options={question.options}
          questionId={question.id as string}
          updateQuestion={updateQuestion}
          key={question.id}
        />
      )}
      {question?.type === "imageUpload" && (
        <ImageUploadType
          isEditing={isEditing}
          questionId={question.id as string}
        />
      )}
      {question?.type === "multipleChoice" && (
        <MultipleChoiceType
          isEditing={isEditing}
          options={question.options}
          questionId={question.id}
          updateQuestion={updateQuestion}
          key={question.id}
        />
      )}
    </motion.div>
  );
}
