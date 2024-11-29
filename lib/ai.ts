import { getSystemPrompt } from "@/prompts/systemprompt";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const schema = {
  title: { type: "string", additionalProperties: false },
  questions: {
    type: "array",
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      question: {
        type: "string",
      },
      type: {
        type: "string",
        enum: ["text", "multipleChoice", "checkbox", "imageUpload"],
      },
      required: {
        type: "boolean",
      },
      options: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["question", "required", "type", "id"],
    title: "Question",
  },
};

export async function getForm(prompt: string, context?: any) {
  // JSON schema as a string for integration with the prompt
  const jsonSchema = JSON.stringify(schema, null, 4);

  // Log context for debugging purposes
  console.log("Context provided:", context);

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: getSystemPrompt(jsonSchema, context),
      },
      {
        role: "user",
        content: `Generate a form, ${prompt}`,
      },
    ],
    model: "llama3-70b-8192",
    temperature: 0,
    stream: false,
    response_format: { type: "json_object" },
  });

  // Return the result content
  return chatCompletion.choices[0].message.content;
}
