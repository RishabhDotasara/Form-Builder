import { getDocumentById, updateDocument } from "@/lib/firestore-utils";
import { DBUser, Form } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

type BodyType = {
    form: Form,
    values: Record<string, string>;
    replyingUserId:string
}

export async function POST(req:NextRequest)
{
    try 
    {
        const body:BodyType = await req.json()
        const { form, values, replyingUserId } = body;
        // const user:any= await getDocumentById("users", form.userId);
        const res = await updateDocument("forms", form?.id as string, {
            ...form,
            responses: [
                {
                    userId: "Anonymous",
                    userName: "Anonymous",
                    responses: values,
                    dateResponded: new Date().getTime(),
                },
                ...(form?.responses || []),
              
            ],
          });
          return NextResponse.json({message:"Submission SuccessFull!"}, {status:200})
    }
    catch(err)
    {
        console.log("Error at Form Submission Endpoint: ", err);
        return NextResponse.json({
            message:"Submission Failed",
        }, {status:500})

    }
}