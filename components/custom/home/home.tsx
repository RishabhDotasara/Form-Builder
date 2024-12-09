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
  Keyboard,
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

import { CommandDialogMenu } from "@/components/ui/command-ai";
import { auth } from "@/lib/firebase";

import {
  Collaborator,
  Form,
  Question,
  QuestionType,
  sharedForms,
} from "@/types/types";
import { log } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  getAllMyDocuments,
  getDocumentsForUser,
  updateDocument,
} from "@/lib/firestore-utils";

import { QuerySnapshot } from "firebase/firestore";




import { useRouter } from "next/navigation";

import { User } from "firebase/auth";
import QuestionBlock from "../questions/question";
import SideBar from "../sidebar/sidebar";
import { ShareDialog } from "./share-form";
import { AddCollaboratorsDialog } from "../collaborators/collaborators-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsesTab } from "./responses-tab";
import FormInterface from "./form-interface";

export default function Home() {
  //categories is collections
  const [categories, setCategories] = useState();
  const [sharedForms, setSharedForms] = useState<sharedForms[] | null>(null);
  const { toast } = useToast();
  const [IsLoading, setIsLoading] = useState<Boolean>(false);

  // A default question to add the form description.
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [activeForm, setActiveForm] = useState<Form | null>(null);
  const [isUpdatingForm, setIsUpdatingForm] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");

  //use at various places to get user info
  const [user, setUser] = useState<User | null>();
  const router = useRouter();

  const getSharedForms = async () => {
    try {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : "";
      setUser(user);
      await getAllMyDocuments(
        "sharedDocuments",
        user.uid,
        (data: sharedForms[]) => {
          log("Shared Forms: " + [...data]);
          setSharedForms(data);
        }
      );
    } catch (err) {
      log(err);
      toast({
        title: "Error Fetching Shared Forms",
        description: "Please Refresh The Page!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string) || "";
    if (!user) {
      router.push("/signin");
      return;
    }

    //get user categories
    const unsubscribe = getDocumentsForUser(
      "category",
      user.uid,
      (data: any) => {
        setCategories(data); // Update state with the latest categories
        console.log(data);
      }
    );

    //get sharedForms
    getSharedForms();

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
      });
      const res = await updateDocument("forms", activeForm?.id as string, {
        ...activeForm,
        questions: questions,
        lastUpdatedBy: user?.displayName || "",
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





  return (
    <div className="h-screen w-full bg-white relative flex overflow-hidden">
      <SidebarProvider>
        <SideBar
          categories={categories}
          setCategories={setCategories}
          activeForm={activeForm}
          setActiveForm={setActiveForm}
          sharedForms={sharedForms}
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
                    activeQuestions={questions}
                  />
                  {/* <ModeToggle/> */}
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

                      {user && activeForm.userId == user.uid && (
                        <AddCollaboratorsDialog
                          activeForm={activeForm}
                          trigger={
                            <Button variant={"default"}>
                              <UserPlus />
                            </Button>
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
                {/* {JSON.stringify(auth.currentUser)} */}
              </div>
            </div>
          </header>

          {activeForm && (
            <FormInterface
              activeForm={activeForm}
              questions={questions}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              updateForm={updateForm}
              isUpdatingForm={isUpdatingForm}
              deleteQuestion={deleteQuestion}
              updateQuestion={updateQuestion}
              addQuestion={addQuestion}
            />
          )}
          {!activeForm && (
            <div className="flex flex-col items-center justify-center  h-5/6 bg-background text-foreground p-8">
              <div className="max-w-md w-full space-y-8 text-center">
                <p className="text-xl text-muted-foreground">
                  Hello, {user?.displayName?.split(" ")[0]} 👋
                </p>
                <div className="space-y-4 text-left">
                  <p className="text-sm text-muted-foreground">
                    Quick actions:
                  </p>
                  <ul className="space-y-2 text-sm">
                    {/* <li className="flex items-center space-x-2 justify-between">
                      <span>✨ Create a New Form</span>
                      <span className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <kbd>Ctrl+Alt+F</kbd>
                      </span>
                    </li> */}
                    <li className="flex items-center space-x-2 justify-between">
                      <span>📂 Create a New Collection</span>
                      <span className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <kbd>Ctrl+Alt+C</kbd>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center space-x-2 pt-4">
                  <Keyboard className="h-4 w-4" />
                  <span>
                    Press{" "}
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-semibold">
                      Ctrl+J
                    </kbd>{" "}
                    for AI assistant
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarProvider>
    </div>
  );
}
