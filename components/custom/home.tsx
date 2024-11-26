"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  ChevronDown,
  Search,
  PlusCircle,
  Upload,
  Download,
  Image as ImageIcon,
  List,
  CheckSquare,
  AlignLeft,
  Share,
  Share2Icon,
  UserPlus,
  UserIcon,
  Loader2,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideBar from "@/components/custom/sidebar";
import { CommandDialogMenu } from "@/components/ui/command-ai";
import { auth } from "@/lib/firebase";
import QuestionBlock from "./questions/question";
import { Form, Question, QuestionType } from "@/types/types";
import { log } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getDocumentsForUser, updateDocument } from "@/lib/firestore-utils";
import { LoadingSkeleton } from "./sidear-loading-skeleton";
import { QuerySnapshot } from "firebase/firestore";
import { Large } from "../ui/large";
import { ShareDialog } from "./share-form";
import { Groq } from "groq-sdk";
import { ScrollArea } from "../ui/scroll-area";

export default function Home() {
  //categories is collections
  const [categories, setCategories] = useState();
  const { toast } = useToast();
  const [IsLoading, setIsLoading] = useState<Boolean>(false);

  // A default question to add the form description.
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [activeForm, setActiveForm] = useState<Form | null>(null);
  const [isUpdatingForm, setIsUpdatingForm] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const unsubscribe = getDocumentsForUser(
      "category",
      user.uid,
      (data: any) => {
        setCategories(data); // Update state with the latest categories
        console.log(data);
      }
    );

    // Cleanup on component unmount
    return () => {
      unsubscribe(); // Stop listening when component is unmounted
    };
  }, []); // This effect depends on user.uid

  useEffect(() => {
    setQuestions(activeForm?.questions as Question[]);
  }, [activeForm]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: "New Question",
      options:
        type === "multipleChoice" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : [],
      required: true,
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestionId(newQuestion.id);
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const updateForm = async () => {
    try {
      setIsUpdatingForm(true);
      console.log({
        ...activeForm,
        questions: questions,
      })
      const res = await updateDocument("forms", activeForm?.id as string, {
        ...activeForm,
        questions: questions,
      });
      setIsUpdatingForm(false);
      toast({
        title: "Success",
        description: "Form Updated Successfully!",
      });
    } catch (err) {
      setIsUpdatingForm(false);
      toast({
        title: "Error",
        description: "Error updating form",
        variant: "destructive",
      });
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const renderQuestionBlock = (question: Question) => {
    const isEditing = editingQuestionId === question.id;

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

  const QuestionTypeSelector = () => {
    return (
      <Select onValueChange={(value: QuestionType) => addQuestion(value)}>
        <SelectTrigger className="w-fit">
          <PlusCircle className="h-4 w-4 font-light mr-2" />
          <SelectValue placeholder="Add" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">
            <div className="flex items-center">
              <AlignLeft className="mr-2 h-4 w-4" />
              Text Question
            </div>
          </SelectItem>
          <SelectItem value="multipleChoice">
            <div className="flex items-center">
              <List className="mr-2 h-4 w-4" />
              Multiple Choice
            </div>
          </SelectItem>
          <SelectItem value="checkbox">
            <div className="flex items-center">
              <CheckSquare className="mr-2 h-4 w-4" />
              Checkbox
            </div>
          </SelectItem>
          <SelectItem value="imageUpload">
            <div className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              Image Upload
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="h-screen w-full bg-white relative flex overflow-hidden">
      <SidebarProvider>
        <SideBar
          categories={categories}
          setCategories={setCategories}
          activeForm={activeForm}
          setActiveForm={setActiveForm}
        />

        <div className="flex-1 overflow-auto">
          <header className="bg-background border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="text-gray-600 hover:text-purple-600" />
              <div className="flex items-center space-x-4">
                <div className="relative flex gap-4">
                  <CommandDialogMenu
                    setActiveForm={setActiveForm}
                    activeForm={activeForm}
                    updateForm={updateForm}
                  />
                  {activeForm && (
                    <div className="flex gap-4">
                      <ShareDialog
                        formId={activeForm.formId}
                        trigger={
                          <Button variant={"outline"}>
                            <Share2Icon />
                          </Button>
                        }
                      />

                      <Button variant={"default"}>
                        <UserPlus />
                      </Button>
                    </div>
                  )}
                </div>
                {/* {JSON.stringify(auth.currentUser)} */}
              </div>
            </div>
          </header>

          {activeForm && (
            <main className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold mb-6 text-purple-600">
                    {activeForm?.name}
                  </h2>
                  {/* <QuestionTypeSelector /> */}
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
                </div>
                <div className="space-y-4 flex flex-col justify-center items-center h-4/5">
                  <ScrollArea className="w-full">
                    {questions && questions.map(renderQuestionBlock)}
                  </ScrollArea>
                  <QuestionTypeSelector />
                </div>
              </div>
            </main>
          )}
          {!activeForm && (
            <div className="flex items-center justify-center h-4/5">
              <h1 className="text-6xl text-muted font-bold">
                No Form Selected
              </h1>
            </div>
          )}
        </div>
      </SidebarProvider>
    </div>
  );
}
