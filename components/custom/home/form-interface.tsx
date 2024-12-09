import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ResponsesTab } from "./responses-tab";
import { Button } from "@/components/ui/button";
import { InfoIcon, Loader2, Lock, MoreVertical, Save, Unlock } from "lucide-react";
import QuestionTypeSelector from "./question-block";
import { Form, Question } from "@/types/types";
import QuestionBlock from "../questions/question";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { H3 } from "@/components/ui/h3";
import { Small } from "@/components/ui/small";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { updateDocument } from "@/lib/firestore-utils";

export default function FormInterface({
  activeForm,
  questions,
  activeTab,
  setActiveTab,
  updateForm,
  isUpdatingForm,
  deleteQuestion,
  updateQuestion,
  addQuestion,
}: {
  activeForm: Form;
  questions: Question[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  updateForm: any;
  isUpdatingForm: boolean;
  deleteQuestion: any;
  updateQuestion: any;
  addQuestion:any
}) {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(activeForm.isOpen);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const {toast} = useToast(); 

  const renderQuestionBlock = (question: Question) => {
    return (
      <QuestionBlock
        question={question}
        editingQuestionId={editingQuestionId as string}
        deleteQuestion={deleteQuestion}
        setEditingQuestionId={setEditingQuestionId}
        updateQuestion={updateQuestion}
        updateForm={updateForm}
        key={question.id}
      />
    );
  };

  const handleFormStatusChange = async ()=>{
    try 
    {
      setIsUpdatingStatus(true);
      //update the form status
      await updateDocument("forms", activeForm.id, {isOpen: !isFormOpen});
      setIsFormOpen(!isFormOpen);
      setIsUpdatingStatus(false);
    }
    catch(err)
    {
      setIsUpdatingStatus(false);
      toast({
        title: "Error Changing Form Status!",
        description: "Please Try Again.",
        variant: "destructive"
      })
    }
  }

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-purple-600">
              {activeForm?.name}
            </h2>
            <span className="text-xs text-muted-foreground">
              Last Updated By: {activeForm.lastUpdatedBy}
            </span>
          </div>
          {/* <QuestionTypeSelector /> */}
          {/* SAVE BUTTON */}
          <div className="flex items-center justify-center gap-2">
            
            <Tooltip delayDuration={200} >
              <TooltipTrigger>
                <InfoIcon className="text-muted-foreground h-4 w-4"/>
              </TooltipTrigger>
              <TooltipContent className="bg-background text-foreground">
                <Small>Save Form</Small>
                <p>This Saves and Applies Changes to the Live Form.</p> 
              </TooltipContent>
            </Tooltip>
            <Button
              onClick={() => {
                updateForm();
              }}
              disabled={isUpdatingForm}
              className="sticky top-8 right-8"
            >
              {isUpdatingForm && <Loader2 className="animate-spin" />}{" "}
              {!isUpdatingForm && <Save />}Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {!isUpdatingStatus && <MoreVertical className="h-4 w-4" />}
                  {isUpdatingStatus && <Loader2 className="animate-spin h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={()=>{handleFormStatusChange()}}>
                  {isFormOpen ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Close Form
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Open Form
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Form Editor</TabsTrigger>
            <TabsTrigger value="responses">
              Responses{" "}
              <Badge className="ml-2">{activeForm.responses.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-6">
            <ScrollArea>
              {questions && questions.map(renderQuestionBlock)}
            </ScrollArea>
            <div className="mt-4 w-full flex justify-center">
              <QuestionTypeSelector addQuestion={addQuestion}/>
            </div>
          </TabsContent>
          <TabsContent value="responses" className="mt-6">
            <ResponsesTab
              responses={activeForm.responses}
              questions={questions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
