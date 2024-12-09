import { addDocument, getDocumentById } from "@/lib/firestore-utils";
import { Form } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

type Body = {
    userId:string,
    formName:string,
    userName:string
}

export async function POST(req: NextRequest) {
  try {
    const body:Body = await req.json();
    //first check if the user has an account here
    const user = await getDocumentById("users", body.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    //now, since the user exists, we gonna create the form for the user.
    const id = new Date().getTime().toString();
    const formData: Omit<Form, "id"> = {
      formId: id,
      name: body.formName,
      userId: body.userId || "",
      questions: [],
      responses: [],
      lastUpdatedBy:body.userName,
      collaborators: [],
      isOpen:true
    };
    await addDocument("forms", formData);
    await addDocument("sharedDocuments", {formId:id, userId:body.userId, formName:body.formName})

    //now return the share link for the form
    const shareLink = `${window.location.origin}/form/share/${id}`
    return NextResponse.json({message:"Form Created!", shareLink}, {status:200})

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error Creating Form" },
      { status: 500 }
    );
  }
}
