import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { formatSuggestions } from "./formatter";
import { useStore } from "../store";

export type PromptStage =
  | "appropriateness"
  | "completion"
  | "formatting"
  | "suggestions"
  | "pruning-suggestions"
  | "explaining"
  | "idle";

export type CompletionMessage = {
  html: string;
  changed: string;
  explanation: string;
};

export type SuggestionsMessage = {
  suggestions: CompletionMessage[];
};

export type CheckMessage = {
  differentIndices: number[];
};

export type ExplanationMessage = {
  explanation: string;
};

export type RequestType = "explain" | "chaange";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  organization: process.env.REACT_APP_OPENAI_ORG_ID,
  dangerouslyAllowBrowser: true,
});

const generateSuggestionsPrompt = (
  html: string,
  highlighted: string | null
) => {
  return (
    input: string
  ) => `Based on the following html code: ${html}, suggest a way of making the following changes: ${input}.
  Make ONLY the changes the user asked for above.
    ${
      highlighted
        ? `The change should be made around here: ${highlighted}.`
        : ""
    }
    Reply in the following JSON format: {html: "...", "explanation": "...", "changed": "..."},
    where the "html" field should contain suggested HTML code generated and the "explanation" field should contain an explanation for what was changed in one sentence from the input.
    In the next two sentences, provide an explanation on how the generated code works.
    The "html" field should contain the entire HTML code of the website, including ALL previous content and changes. UNDER NO CIRCUMSTANCES should you skip any parts of the input HTML in your response.
    Always return the entire code, even the unchanged parts.
    The "changed" field should contain only the changed part of the HTML code.
    ALL HTML code elements should have an ID.
    Your anwser should contain nothing else than the JSON object.
    UNDER NO CIRCUMSTANCES reply with any other text than the JSON above.`;
};

const suggestionsSchema = {
  type: "object",
  properties: {
    html: {
      type: "string",
    },
    explanation: {
      type: "string",
    },
    changed: {
      type: "string",
    },
  },
  required: ["html", "explanation", "changed"],
};

const checkSuggestionsPrompt = (message: CompletionMessage[]) => {
  return () => `Based on the following list of HTML codes, filter out the ones that are different to each other.
  Return the indices of the HTML codes (indexed from zero) that were found different in the following JSON format: [number, number, number].
  The array should ALWAYS contain at least one number. DO NOT return an empty array.
  UNDER NO CIRCUMSTANCES should you reply with any other text than the JSON array of numbers.
  
  ${message
    .map((completion, index) => `${index + 1}. ${completion.changed}`)
    .join("\n")}
  `;
};

const checkSchema = {
  type: "object",
  properties: {
    differentIndices: {
      type: "array",
      items: {
        type: "integer",
      },
    },
  },
};

const generateExplainPrompt = (html: string) => {
  return (input: string) => `
  Answer the following question: ${input}.
  The answer should be in the following JSON format: {"explanation": "..."}.

  The question might be related to the previous messages, or the following HTML code: ${html}.
  `;
};

const explainSchema = {
  type: "object",
  properties: {
    explanation: {
      type: "string",
    },
  },
  required: ["explanation"],
};

export async function getExplanationResponse(
  input: string,
  reportProgress: (stage: PromptStage) => void
): Promise<ExplanationMessage | null> {
  const messages = useStore.getState().messages.map((m) => m.message);
  const currentHtml = useStore.getState().currentHtml;

  reportProgress("explaining");
  const explanation = await promptGpt<ExplanationMessage>(
    messages,
    input,
    generateExplainPrompt(currentHtml),
    explainSchema
  );

  return explanation;
}

export async function getGptResponse(
  input: string,
  reportProgress: (stage: PromptStage) => void,
  highlighted: string | null
): Promise<CompletionMessage[] | null> {
  const messages = useStore.getState().messages.map((m) => m.message);
  const currentHtml = useStore.getState().currentHtml;
  reportProgress("suggestions");
  let suggestions = (
    await promptGpt<SuggestionsMessage>(
      messages,
      input,
      generateSuggestionsPrompt(currentHtml, highlighted),
      suggestionsSchema,
      3
    )
  )?.suggestions;
  if (!suggestions) {
    return null;
  }

  reportProgress("pruning-suggestions");
  let check = (
    await promptGpt<CheckMessage>(
      messages,
      input,
      checkSuggestionsPrompt(suggestions),
      checkSchema
    )
  )?.differentIndices;
  if (!check || check.length === 0) {
    suggestions = formatSuggestions(suggestions);
    return suggestions;
  }
  check = check?.filter((index) => index >= 0 && index < suggestions!.length);
  if (check.length === 0) {
    suggestions = formatSuggestions(suggestions);
    return suggestions;
  }

  suggestions = check?.map((index) => suggestions![index]) ?? suggestions;

  suggestions = formatSuggestions(suggestions);
  return suggestions;
}

const promptGpt = async <T>(
  messages: ChatCompletionMessageParam[],
  input: string,
  prompt: (input: string) => string,
  schema: any,
  numChoices = 1
): Promise<T | null> => {
  const requestMessages = [
    ...messages,
    { role: "user" as const, content: prompt(input) },
  ];

  const response = await openai.chat.completions.create({
    model: useStore.getState().llm,
    messages: requestMessages,
    functions: [{ name: "jsonify", parameters: schema }],
    function_call: { name: "jsonify" },
    n: numChoices,
  });

  if (numChoices > 1) {
    const result: any[] = [];
    for (const choice of response.choices) {
      if (choice.message.function_call?.arguments) {
        const message = JSON.parse(choice.message.function_call.arguments) as T;
        if (message) {
          result.push(message);
        }
      } else if (choice.message.content) {
        const message = JSON.parse(choice.message.content) as T;
        if (message) {
          result.push(message);
        }
      }
    }

    return { suggestions: result } as T;
  }

  if (response.choices[0].message.function_call?.arguments) {
    const message = JSON.parse(
      response.choices[0].message.function_call.arguments
    ) as T;
    if (message) {
      return message;
    }
  } else if (response.choices[0].message.content) {
    const message = JSON.parse(response.choices[0].message.content) as T;
    if (message) {
      return message;
    }
  }

  return null;
};
