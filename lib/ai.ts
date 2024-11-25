import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const schema = {
  title: { type: "string", additionalProperties: false },
  question: {
    type: "object",
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

export async function getForm(prompt: string, context: any) {
  // JSON schema as a string for integration with the prompt
  const jsonSchema = JSON.stringify(schema, null, 4);

  // Log context for debugging purposes
  console.log("Context provided:", context);

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a form generator that outputs questions in JSON format.\n` +
                 `There must be at least three questions that make sense based on the provided prompt.\n` +
                 `Guide the form generation using the collection of previous questions:\n ${JSON.stringify(context, null, 2)}\n` +
                 `The JSON object must use the following schema:\n ${jsonSchema}`,
      },
      {
        role: "user",
        content: `Generate a form with the following prompt: ${prompt}`,
      },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0,
    stream: false,
    response_format: { type: "json_object" },
  });

  // Return the result content
  return chatCompletion.choices[0].message.content;
}
