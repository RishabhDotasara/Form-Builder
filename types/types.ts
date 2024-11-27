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
  required?: BinaryDataoolean;
}

type FormResponse = {
  userId:string,
  userName:string,
  responses: Record<string, string>;
}

export type Form = {
  id: string; // Firestore document ID
  name: string; // Name of the form
  userId: string; // User ID associated with the form
  questions: Array<any>; // Array of questions, can specify type if known
  formId: string; // Custom form identifier
  responses:FormResponse[]
};


export type Category = {
  id:string,
  forms:Form[],
  name:string,
  userId:string
}

//expected types from the ai for input type
export const keywords = {
  "text":["text", "textarea"],
  "imageUpload":["imageUpload"],
  "multipleChoice":["multipleChoice"],
  "checkbox":["checkbox"]
}