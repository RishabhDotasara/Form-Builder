// This should have the question title, which will be common for all of the question types, but the question body will be different.

import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import TextType from "./questions_types/text";
import CheckBoxType from "./questions_types/checkbox";
import ImageUploadType from "./questions_types/imageUpload";
import MultipleChoiceType from "./questions_types/multipleChoiceType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { keywords, Question } from "@/types/types";
import { SelectValue } from "@radix-ui/react-select";

export default function QuestionBlock({
  question,
  editingQuestionId,
  setEditingQuestionId,
  updateQuestion,
  deleteQuestion,
   updateForm
}: {
  question?: Question;
  editingQuestionId?: string;
  setEditingQuestionId?: Dispatch<SetStateAction<string | null>>;
  updateQuestion?: (id: string, updates: Partial<Question>) => void;
  deleteQuestion?: (id:string) => void;
  updateForm?: () => void;
}) {         
  const isEditing = editingQuestionId === question?.id;

  return (
    <motion.div
      key={question?.id}
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
              value={question?.question}
              onChange={(e) =>
                // @ts-ignore
                updateQuestion(question?.id as string, { question: e.target.value })
              }
              className="font-bold text-lg "
            />
            <Select
              onValueChange={(value: string) =>
                // @ts-ignore
                updateQuestion(question?.id, {
                  required: value === "r" ? true : false,
                })
              }
              value={question?.required ? "r" : "nr"}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="r">
                  <span className="text-red-500">*</span>
                </SelectItem>
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
          {isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // @ts-ignore
                setEditingQuestionId(null);
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              // @ts-ignore
              onClick={() => setEditingQuestionId(question.id)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            // @ts-ignore
            onClick={() => deleteQuestion(question.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Question Body Part */}
      {keywords.text.includes(question?.type as string) && <TextType isEditing={isEditing} />}
      {keywords.checkbox.includes(question?.type as string) && (
        <CheckBoxType
          isEditing={isEditing}
          options={question?.options}
          questionId={question?.id as string}
          // @ts-ignore
          updateQuestion={updateQuestion}
          key={question?.id}
        />
      )}
      {keywords.imageUpload.includes(question?.type as string) && (
        <ImageUploadType
          isEditing={isEditing}
          questionId={question?.id as string}
        />
      )}
      {keywords.multipleChoice.includes(question?.type as string) && (
        <MultipleChoiceType
          isEditing={isEditing}
          options={question?.options}
          questionId={question?.id as string}
          // @ts-ignore
          updateQuestion={updateQuestion}
          key={question?.id}
        />
      )}
    </motion.div>
  );
}
