import { StepType, StylesObj } from "@reactour/tour";
import { CompletionMessage, PromptStage } from "./gpt";
import { MaskStylesObj } from "@reactour/mask";
import { PopoverStylesObj } from "@reactour/popover";
import { darkTheme, lightTheme } from "../theme/themes";

export const tourSteps: StepType[] = [
  {
    selector: "body",
    content:
      "Welcome to GPTerraform! This application allows you to create a website with the help of an AI assistant.",
    position: "center",
  },
  {
    selector: "#tour-browser",
    content:
      "The preview panel shows how your website looks currently. Any changes by you or the AI assistant are reflected here immediately.",
  },
  {
    selector: "#tour-chat",
    content:
      "The chat panel shows the conversation between you and the AI assistant. You can ask it to add, change or remove elements from your website.",
  },
  {
    selector: "#tour-code",
    content:
      "The code panel shows the HTML code of your website. You can edit it directly and the changes will be reflected in the preview panel. If the AI assistant makes any changes to the code, that will also show up here.",
  },
  {
    selector: "#tour-highlight",
    content:
      "You can highlight elements by clicking this button, then clicking on the element you want to ask the AI assistant about. Once selected, you can refer to the element as 'this' in your next message, without needing to describe where it is or how it looks. Click on it now.",
    disableActions: true,
  },
  {
    selector: "#tour-browser",
    content: "Click on the 'Hello world' text.",
    disableActions: true,
  },
  {
    selector: "#tour-code",
    content: "The element is also highlighted in your code.",
    disableActions: false,
  },
  {
    selector: "#tour-chat",
    content:
      "Ask the AI assistant to make it italic, for example by simply sending the message 'Make this italic.'",
    disableActions: true,
  },
  {
    selector: "#tour-chat",
    content: "Wait for the assistant to process your request.",
    disableActions: true,
  },
  {
    selector: "#tour-suggestions",
    content:
      "The assistant came up with two suggestions. You can see the preview of how it looks, the new code, as well as the assistant explaining what was changed. You can also hover over the suggestions to see more details. Accept one of them now.",
    disableActions: true,
  },
  {
    selector: "#tour-chat",
    content:
      "If you change your mind about the assistant's changes, you can revert to a previous state by clicking on a message. Click on the assistant's first message now.",
    disableActions: true,
  },
  {
    selector: "#tour-chat",
    content:
      "Unsure on what the assistant did or coding concepts? Switch from 'Change' mode to 'Explain' in the dropdown next to the send button.",
    disableActions: true,
  },
  {
    selector: "#tour-chat",
    content:
      "Ask a question about the page or HTML, for example, 'What does an h1 tag do'?",
    disableActions: true,
  },
  {
    selector: "#tour-chat",
    content:
      "The assistant will simply answer your question without making code changes. Switch back to 'Change' mode on the dropdown to if you want to make changes again.",
    disableActions: false,
  },
  {
    selector: "#tour-settings",
    content:
      "You can change the theme, the GPT model being used and the experiment task in the settings panel.",
    disableActions: false,
  },
  {
    selector: "#tour-reset",
    content:
      "That's it! You can always reset the application here to start over.",
    disableActions: false,
  },
];

export const createTourStyles = (
  theme: "light" | "dark"
): StylesObj & PopoverStylesObj & MaskStylesObj => {
  const themeObj = theme === "light" ? lightTheme : darkTheme;

  return {
    popover: (base) => ({
      ...base,
      backgroundColor: themeObj.colors.backgroundLight,
      color: themeObj.colors.browserColor,
      borderRadius: "10px",
    }),
    close: (base) => ({
      ...base,
      color: themeObj.colors.browserColor,
    }),
    badge: (base) => ({
      ...base,
      backgroundColor: themeObj.colors.accent.normal,
      fontWeight: "bold",
    }),
    arrow: (base, { disabled }: any) => ({
      ...base,
      color: themeObj.colors.browserColor,
      opacity: disabled ? 0.3 : 1,
    }),
    dot: (base, { current }: any) => ({
      ...base,
      backgroundColor: current
        ? themeObj.colors.accent.normal
        : base.backgroundColor,
    }),
  };
};

export const darkTourStyles: StylesObj & PopoverStylesObj & MaskStylesObj = {
  popover: (base) => ({
    ...base,
    backgroundColor: darkTheme.colors.backgroundLight,
    color: darkTheme.colors.browserColor,
    borderRadius: "10px",
  }),
  close: (base) => ({
    ...base,
    color: darkTheme.colors.browserColor,
  }),
  badge: (base) => ({
    ...base,
    backgroundColor: darkTheme.colors.accent.normal,
    fontWeight: "bold",
  }),
  arrow: (base, { disabled }: any) => ({
    ...base,
    color: darkTheme.colors.browserColor,
    opacity: disabled ? 0.3 : 1,
  }),
};

export async function getFakeGtpResponse(
  _: number,
  reportProgress: (stage: PromptStage) => void,
  __: string | null
): Promise<CompletionMessage[] | null> {
  reportProgress("suggestions");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return Promise.resolve([
    {
      html: `<body>\n    <h1 style="font-style: italic;">Hello world!</h1>\n</body>`,
      explanation:
        "Added an inline style to the h1 tag to make the text italic.",
      changed: `<body>\n    <h1 style="font-style: italic;">Hello world!</h1>\n</body>`,
    },
    {
      html: `<body>\n    <h1><i>Hello world!</i></h1>\n</body>`,
      explanation: "Wrapped the text with <i> tags to make it italic.",
      changed: `<body>\n    <h1><i>Hello world!</i></h1>\n</body>`,
    },
  ]);
}
