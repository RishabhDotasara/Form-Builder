"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FormQuestion } from "@/components/custom/form-shared";
import { useToast } from "@/hooks/use-toast";
import { getFormByFormId, updateDocument } from "@/lib/firestore-utils";
import { Form, Question } from "@/types/types";
import { Loader2 } from "lucide-react";
import { User } from "firebase/auth";

interface FormData {
  id: string;
  question: string;
  required: boolean;
  type: string;
}

// This would typically come from your API or database
const mockFormData: FormData[] = [
  {
    id: "1732471369333",
    question: "Title of the first test form.",
    required: true,
    type: "text",
  },
  {
    id: "1732471369334",
    question: "Please provide a detailed description.",
    required: false,
    type: "textarea",
  },
  {
    id: "1732471369335",
    question: "What is your favorite color?",
    required: true,
    type: "text",
  },
];

export default function SharedFormPage() {
  const params = useParams();
  const formId = params.id as string;
  const [formResponses, setFormResponses] = useState<Record<string, string>>({
    id: new Date().getTime().toString(),
  });
  const [form, setForm] = useState<Form | null>(null);
  const [IsLoadingForm, setIsLoadingForm] = useState(true)
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleResponseChange = (id: string, value: string) => {
    const question = form?.questions.find((q) => q.id === id);
    console.log(question)
    setFormResponses((prev) => ({ ...prev, [id]: value }));
  };

  const getUserFacingForm = async (id: string) => {
    try {
      setIsLoadingForm(true)
      await getFormByFormId(id, (data: Form | null) => {
        console.log(data);
        setForm(data);
      }); //formId
      
      
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Loading Form!",
        description: "Please Refresh The Page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getUserFacingForm(formId).then(()=>{
      setIsLoadingForm(false)
    });
  }, []);

  // useEffect(() => {
  //   console.log(formResponses);
  // }, [formResponses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    try
    {
      console.log(formResponses)
      const user = JSON.parse(localStorage.getItem('user') as string)
      const res = await updateDocument('forms', form?.id as string, {...form, responses:[{userId:user.uid || "N/A", userName:user.displayName || "N/A", responses:formResponses, dateResponded:new Date().getTime()},...(form?.responses || [])]})
      toast({
        title:'Form Submitted!',
        description:'Thank you for your response.',
      })
      setIsSubmitting(false)
      setFormSubmitted(true)
    }
    catch(err)
    {
      setIsSubmitting(false)
      console.log(err)
      toast({
        title: "Error Submitting Form!",
        description: "Please Try Again.",
        variant: "destructive",
      })
    }
  };

  if (IsLoadingForm || !form)
  {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12"/>
      </div>
    )
  }

  else 
  {
    return (
      <>
        {!formSubmitted && (
          <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {form?.name}
              </CardTitle>
              <CardDescription className="text-center">
                Please fill out the form below
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                {form?.questions.map((question: Question) => {
                  return (
                    <FormQuestion
                      key={question.id}
                      question={question}
                      onChange={handleResponseChange}
                    />
                  );
                })}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting} onClick={handleSubmit}>
                  Submit {isSubmitting && <Loader2 className="animate-spin ml-2"/>}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        )}
        {formSubmitted && (
          <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {form?.name}
                </CardTitle>
                <CardDescription className="text-center">
                  Thank you for your response!
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </>
    );
  }
}
