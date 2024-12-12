import { User } from "firebase/auth";

export type QuestionType =
  | "text" 
  | "multipleChoice"
  | "checkbox"
  | "imageUpload"
  | "textarea"
  | "description";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required?: boolean;
  // default:string
}

type FormResponse = {
  userId:string,
  userName:string,
  responses: Record<string, string>;
}

export type Collaborator = User & {
  role: "editor" | "viewer";
};

export type Form = {
  id: string; // Firestore document ID
  name: string; // Name of the form
  userId: string; // User ID associated with the form
  questions: Array<any>; // Array of questions, can specify type if known
  formId: string; // Custom form identifier
  responses:FormResponse[],
  lastUpdatedBy:string,
  collaborators:Collaborator[],
  isOpen:boolean
};

export type sharedForms = {formId:string, formName:string}

export type Category = {
  id:string,
  forms:Form[],
  name:string,
  userId:string
}

export type DBUser = {
  email:string,
  displayName:string,
  photoURL:string,
}
//expected types from the ai for input type
export const keywords = {
  "text":["text", "textarea"],
  "imageUpload":["imageUpload"],
  "multipleChoice":["multipleChoice"],
  "checkbox":["checkbox"]
}