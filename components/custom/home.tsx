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
import { Question, QuestionType } from "@/types/types";
import { log } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getDocumentsForUser } from "@/lib/firestore-utils";
import { LoadingSkeleton } from "./sidear-loading-skeleton";

export default function Home() {
  //categories is collections 
  const [categories, setCategories] = useState([
    { name: "Surveys", forms: ["Customer Feedback", "Employee Satisfaction"] },
    { name: "Quizzes", forms: ["Product Knowledge", "Team Building"] },
    { name: "Surveys", forms: ["Customer Feedback", "Employee Satisfaction"] },
    { name: "Quizzes", forms: ["Product Knowledge", "Team Building"] },
    { name: "Surveys", forms: ["Customer Feedback", "Employee Satisfaction"] },
    { name: "Quizzes", forms: ["Product Knowledge", "Team Building"] },
  ]);
  const {toast} = useToast()
  const [IsLoading, setIsLoading] = useState<Boolean>(false)

  // A default question to add the form description.
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now().toString(),
      question: "Form Description",
      type: "text",
      required: true,
    },
  ]);

  //functions to get the current categories and forms
  const getCategories = async ()=>{
    try 
    {
      setIsLoading(true)
      const c = await getDocumentsForUser("collections", JSON.parse(localStorage.getItem("user") as string).uid)
      console.log(c)
      setIsLoading(false)
    }
    catch(err)
    {
      setIsLoading(false)
      log(err as string)
      toast({
        title:"Error loading Documents",
        description:"Please Try again!"
      })
    }
  }

  useEffect(()=>{
    getCategories().then(()=>{console.log("FUnction Done!");
    })
  },[])
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [activeForm, setActiveForm] = useState(categories[0].forms[0]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: "New Question",
      options:
        type === "multipleChoice" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : undefined,
      required: true,
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestionId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
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
                <div className="relative">
                  <CommandDialogMenu />
                  {/* {JSON.stringify(auth.currentUser)} */}
                </div>
                <div className="flex gap-4">
                  <Button variant={"outline"}>
                    <Share2Icon />
                  </Button>
                  <Button variant={"default"}>
                    <UserPlus />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between">
                <h2 className="text-3xl font-bold mb-6 text-purple-600">
                  {activeForm}
                </h2>
                {/* <QuestionTypeSelector /> */}
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center">
                {questions.map(renderQuestionBlock)}
                <QuestionTypeSelector />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
