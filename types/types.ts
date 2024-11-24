
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