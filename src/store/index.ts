import { ChatCompletionMessageParam } from "openai/resources/chat";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExperimentTask } from "../services/tasks";
import { defaultHtml } from "../services/htmls";

interface ChatMessage {
  message: ChatCompletionMessageParam;
  code: string;
}

export const supportedLlms = [
  "gpt-4-1106-preview",
  "gpt-3.5-turbo-1106",
] as const;
export type SupportedLlm = (typeof supportedLlms)[number];

export interface AppState {
  messages: ChatMessage[];
  currentHtml: string;
  theme: "light" | "dark";
  llm: SupportedLlm;
  experimentTask: ExperimentTask;
  setExperimentTask: (task: ExperimentTask) => void;
  setLlm: (llm: SupportedLlm) => void;
  toggleTheme: () => void;
  addMessage: (message: ChatMessage, code?: string) => void;
  revertToMessage: (index: number) => void;
  changeHtml: (html: string) => void;
  reset: () => void;
}

export const useStore = create(
  persist<AppState>(
    (set, get) => ({
      messages: [
        {
          message: {
            role: "user",
            content: "Add a title saying 'Hello world!' to the page.",
          },
          code: "",
        },
        {
          message: {
            role: "assistant",
            content: "Added an h1 tag with the content 'Hello world!'.",
          },
          code: `<body>\n    <h1>Hello world!</h1>\n</body>`,
        },
      ],
      addMessage: (message, code) =>
        set({
          messages: [
            ...get().messages,
            { ...message, code: code ? code : get().currentHtml },
          ],
          currentHtml: code ? code : get().currentHtml,
        }),
      revertToMessage: (index) =>
        set({
          messages: get().messages.slice(0, index + 1),
          currentHtml: get().messages[index]?.code,
        }),
      currentHtml: `<body>\n    <h1>Hello world!</h1>\n</body>`,
      changeHtml: (html) => {
        return set({ currentHtml: html });
      },
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      llm: supportedLlms[0],
      setLlm: (llm) => set({ llm }),
      reset: () =>
        set({
          messages: [],
          currentHtml: defaultHtml,
        }),
      experimentTask: "none",
      setExperimentTask: (task) => set({ experimentTask: task }),
      ...(window as any).savedState,
    }),
    {
      name: "gpterraform-storage",
      partialize: (state) =>
        ({
          theme: state.theme,
          llm: state.llm,
        } as any),
    }
  )
);

useStore.subscribe((state) => {
  (window as any).savedState = state;
});
