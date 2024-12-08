"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Send,
  X,
  Loader2,
  BrainCircuit,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getForm } from "@/lib/ai";
import { Form, Question } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

export function CommandDialogMenu({
  setActiveForm,
  activeForm,
  updateForm,
  activeQuestions
}: {
  setActiveForm: React.Dispatch<React.SetStateAction<Form | null>>;
  activeForm: Form | null;
  updateForm: any;
  activeQuestions:Question[]
}) {
  const [open, setOpen] = React.useState(false);
  const [aiInputVisible, setAiInputVisible] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState("");
  const [isLoadingAnswer, setIsLoadingAnswer] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAiInputVisible((visible) => !visible);
        if (!aiInputVisible) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [aiInputVisible]);

  const handleOpen = () => setOpen(true);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AI Prompt submitted:", aiPrompt);
    try {
      if (!activeForm) {
        toast({
          title: "No Form Selected!",
          description: "Please select a form to use the AI features.",
          variant: "destructive",
        });
      } else {
        setIsLoadingAnswer(true);
        const res = await getForm(aiPrompt, activeQuestions);
        const json = JSON.parse(res as string);
        console.log(json)
        setActiveForm({
          ...activeForm,
          questions: [...activeQuestions, ...json.questions],
        });
        setAiPrompt("");
        setAiInputVisible(false);
        setIsLoadingAnswer(false);
      }
    } catch (err) {
      setIsLoadingAnswer(false);
      console.log(err);
      toast({
        title: "Error",
        description: "Error at the AI Engine.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        {/* Full input for larger screens */}
        <div className="hidden sm:flex text-sm text-muted-foreground cursor-pointer border items-center justify-center px-2 rounded-md shadow-sm transition-all duration-200 hover:border-primary">
          <Input
            className="border-none outline-none cursor-pointer ring-none"
            placeholder="Ask AI.."
            onClick={() => setAiInputVisible(true)}
            readOnly
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </div>

        {/* Search icon for small screens */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setAiInputVisible(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Open AI input</span>
        </Button>
      </div>

      {aiInputVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-card rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleAiSubmit} className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">FormAI</h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={()=>{setAiInputVisible(false)}}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  className="flex-1"
                  placeholder="Ask AI anything..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button type="submit" disabled={isLoadingAnswer}>
                  {isLoadingAnswer ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ask AI to help you with your form creation process. Be specific for better results.
              </p>
            </div>
          </form>
        </div>
      </div>
      )}
    </>
  );
}
