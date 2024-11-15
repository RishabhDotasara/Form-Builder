"use client";

import { useState } from "react";
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

type QuestionType = "text" | "multipleChoice" | "checkbox" | "imageUpload";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
}

export default function Home() {
  const [categories, setCategories] = useState([
    { name: "Surveys", forms: ["Customer Feedback", "Employee Satisfaction"] },
    { name: "Quizzes", forms: ["Product Knowledge", "Team Building"] },
    { name: "Surveys", forms: ["Customer Feedback", "Employee Satisfaction"] },
    { name: "Quizzes", forms: ["Product Knowledge", "Team Building"] },
    { name: "Surveys", forms: ["Customer Feedback", "Employee Satisfaction"] },
    { name: "Quizzes", forms: ["Product Knowledge", "Team Building"] },
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
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
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-4 p-4 bg-white rounded-lg shadow"
      >
        <div className="flex justify-between items-center mb-2">
          {isEditing ? (
            <Input
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, { question: e.target.value })
              }
              className="font-bold text-lg"
            />
          ) : (
            <h3 className="font-bold text-lg">{question.question}</h3>
          )}
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditingQuestionId(isEditing ? null : question.id)
              }
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
        {question.type === "text" && (
          <Textarea
            placeholder="Enter your answer"
            disabled={!isEditing}
            className="w-full mt-2"
          />
        )}
        {question.type === "multipleChoice" && (
          <RadioGroup className="space-y-2 mt-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${question.id}-${index}`}
                  disabled={!isEditing}
                />
                {isEditing ? (
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      updateQuestion(question.id, { options: newOptions });
                    }}
                    className="flex-grow"
                  />
                ) : (
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateQuestion(question.id, {
                    options: [...(question.options || []), "New Option"],
                  })
                }
              >
                Add Option
              </Button>
            )}
          </RadioGroup>
        )}
        {question.type === "checkbox" && (
          <div className="space-y-2 mt-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  disabled={!isEditing}
                />
                {isEditing ? (
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      updateQuestion(question.id, { options: newOptions });
                    }}
                    className="flex-grow"
                  />
                ) : (
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateQuestion(question.id, {
                    options: [...(question.options || []), "New Option"],
                  })
                }
              >
                Add Option
              </Button>
            )}
          </div>
        )}
        {question.type === "imageUpload" && (
          <div className="mt-2">
            <Label htmlFor={`${question.id}-image`} className="block mb-2">
              Upload Image
            </Label>
            <Input
              id={`${question.id}-image`}
              type="file"
              accept="image/*"
              disabled={!isEditing}
            />
          </div>
        )}
      </motion.div>
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
              <h2 className="text-3xl font-bold mb-6 text-purple-600">
                {activeForm}
              </h2>
              <div className="space-y-4">
                {questions.map(renderQuestionBlock)}
                <Select
                  onValueChange={(value: QuestionType) => addQuestion(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add a new question" />
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
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
