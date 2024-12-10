import { getDocumentById, getFormByFormId } from "@/lib/firestore-utils";
import { Form, Question } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod"

type BodyJson = {
    formId:string // this is the actual document Id and not the formId generated one!
}


export async function POST(req:NextRequest){
    try 
    {   
        
        const body:BodyJson= await req.json()
        const form:any= await getDocumentById("forms", body.formId)
        if(!form)
        {
            return NextResponse.json({message:"Form Not Found!"}, {status:404})
        }

        return NextResponse.json({form:form}, {status:200})
    }
    catch(err)
    {
        console.log(err)
        return NextResponse.json({message:"Error On Server, Please Try Again!"}, {status:500})
    }
}