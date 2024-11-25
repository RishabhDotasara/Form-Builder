export type QuestionType =
  | "text"
  | "multipleChoice"
  | "checkbox"
  | "imageUpload"
  | "description";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required?: Boolean;
}

export type Form = {
  id: string; // Firestore document ID
  name: string; // Name of the form
  userId: string; // User ID associated with the form
  questions: Array<any>; // Array of questions, can specify type if known
  formId: string; // Custom form identifier
};
