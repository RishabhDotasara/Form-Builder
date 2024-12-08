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
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { log } from "@/lib/utils";
import { Large } from "@/components/ui/large";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as UserForm,
} from "@/components/ui/form";
import { auth, provider } from "@/lib/firebase";
import { ToastAction } from "@/components/ui/toast";

export default function SharedFormPage() {
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [IsLoadingForm, setIsLoadingForm] = useState(true);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSchema, setFormSchema] = useState<z.ZodObject<any> | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const getUserFacingForm = async (id: string) => {
    try {
      setIsLoadingForm(true);
      await getFormByFormId(id, (data: Form | null) => {
        log(data);
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
    getUserFacingForm(formId).then(() => {
      setIsLoadingForm(false);
    });
  }, []);

  // Dynamically generate the schema when the form is ready
  useEffect(() => {
    if (!form) return;

    const internalSchema: Record<string, any> = {};
    form.questions.forEach((question: Question) => {
      internalSchema[question.id] = question.required
        ? z.string().min(1, { message: "Required!" })
        : z.string().optional();
    });

    const generatedSchema = z.object(internalSchema);
    setFormSchema(generatedSchema);
  }, [form]);

  // Initialize useForm with the dynamically created schema
  const formForUser = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues: form?.questions.reduce(
      (acc, question) => ({
        ...acc,
        [question.id]: "",
      }),
      {}
    ),
    mode: "onChange",
  });

  //to check if user is looged in or not
  const handlePopupLogin = async ()=>{
    try 
    {
        await signInWithPopup(auth, provider)
        toast({
          title:"Login Successful",
          description:"You are now Logged In",
        })
    }
    catch(err)
    {
      console.log(err)
      toast({
        title:"Error Logging In",
        description:"Please Try Again",
        variant:"destructive"
      })
    }
  }

  useEffect(()=>{
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        log(user);
        setUser(user);
      }
      else 
      {
        toast({
          title:"You are not Logged In",
          description:"Please Login to fill the form",
          action:<ToastAction altText="Login/SignUp" onClick={handlePopupLogin}>Login</ToastAction>
        })
      }
    }
    );
  },[])



  const handleSubmit = async (values:  any) => {
    if(!user)
    {
      toast({
        title:"You are not Logged In",
        description:"Please Login to submit the form.",
        action:<ToastAction altText="Login/SignUp" onClick={handlePopupLogin}>Login</ToastAction>
      })
      return
    }
    console.log(values)
    try {
      setIsSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user") as string) || "";
      console.log(values)
      const res = await updateDocument("forms", form?.id as string, {
        ...form,
        responses: [
          {
            userId: user.uid ? user.uid : "N/A",
            userName: user.displayName ? user.displayName : "N/A",
            responses: values,
            dateResponded: new Date().getTime(),
          },
          ...(form?.responses || []),
        ],
      });
      toast({
        title: "Form Submitted!",
        description: "Thank you for your response.",
      });
      setIsSubmitting(false);
      setFormSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
      toast({
        title: "Error Submitting Form!",
        description: "Please Try Again.",
        variant: "destructive",
      });
    }
  };

  if (IsLoadingForm || !form) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  } else {
    return (
      <>
        {!formSubmitted && formForUser && (
          <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {form?.name}
                </CardTitle>
                <CardDescription className="text-center">
                  Please fill out the form below
                  <Large>
                    <span className="text-red-400">*</span> Required Question
                  </Large>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm {...formForUser}>
                  <form
                    onSubmit={formForUser.handleSubmit(handleSubmit)}
                    className="space-y-6 p-2"
                  >
                    {form?.questions.map((question: Question) => {
                      return (
                        <FormField
                          control={formForUser.control}
                          name={question.id}
                          key={question.id}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {question.question}
                                {question.required && (
                                  <span className="text-red-400">*</span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <FormQuestion question={question} form={formForUser} {...field}/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    })}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="animate-spin mr-2" />
                      )}
                      Submit
                    </Button>
                  </form>
                </UserForm>
              </CardContent>
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
