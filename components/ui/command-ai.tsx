"use client";

import * as React from "react";
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Search, Send, X, Loader2 } from 'lucide-react';

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
import { Form } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

export function CommandDialogMenu({
  setActiveForm,
  activeForm,
  updateForm,
}: {
  setActiveForm: React.Dispatch<React.SetStateAction<Form | null>>;
  activeForm: Form | null;
  updateForm: any;
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
        const res = await getForm(aiPrompt, activeForm.questions);
        const json = JSON.parse(res as string);
        setActiveForm({
          ...activeForm,
          questions: [...json.questions],
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
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in"
            onClick={() => setAiInputVisible(false)}
          />
          <form
            onSubmit={handleAiSubmit}
            className="relative bg-background rounded-xl shadow-2xl overflow-hidden w-full max-w-3xl m-4 animate-in fade-in-90 slide-in-from-bottom-10 sm:zoom-in-90 sm:slide-in-from-bottom-0 duration-300"
          >
            <div className="flex flex-col p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smile className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Ask AI</h2>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setAiInputVisible(false)}
                  className="h-10 w-10"
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  ref={inputRef}
                  className="flex-1 text-lg border-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  placeholder="Ask AI anything..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button type="submit" size="lg" className="h-12 px-6">
                  {!isLoadingAnswer && (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send
                    </>
                  )}
                  {isLoadingAnswer && (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Ask AI to help you with your form creation process. Be specific for better results.
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

