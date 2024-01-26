import { cameraHtml } from "./htmls";

export interface TaskDescription {
  key: string;
  name: string;
  tasks: string[];
  html?: string;
}

export const experimentTasks = [
  "none",
  "camera",
  "researcher",
  "memory",
] as const;
export type ExperimentTask = (typeof experimentTasks)[number];

const tasks: TaskDescription[] = [
  { key: "none", name: "No current task", tasks: [] },
  {
    key: "camera",
    name: "Cameras",
    tasks: [
      'Add a menu item saying "Webshop".',
      'Add a text to the middle of the page saying "We sell cameras".',
      "Ensure there is enough contrast between the background image and title. For example, it should not be a plain white or plain black text. Do not change or restyle the background image.",
      'Add a button under that text saying "Buy". The button should be nice looking, meaning it should have some styles applied on top of a default HTML button.',
    ],
    html: cameraHtml,
  },
  {
    key: "researcher",
    name: "Personal website for a researcher",
    tasks: [
      "Create a personal website for a human-computer interaction researcher living in Denmark.",
      'The website should have an "About me" section, with a short introduction.',
      "It should have a teaching section, with at least one university course they teach and a description for it.",
      "It should also have a research section, listing the title and year of their five most important publications.",
      "At the end, it should have a contact form. The form does not have to be interactive or sendable.",
      "Come up with example content for all sections on your own or using the assistant. Do not leave it with placeholders or empty.",
      "Focus on the structure and content first, then at the end, make the website look more visually appealing.",
      "Add a Danish translation and a way for the user to switch between the two languages.",
    ],
  },
  {
    key: "memory",
    name: "Memory game",
    tasks: [
      "Implement a memory game with HTML and JavaScript.",
      "Add at least 10 cards randomly positioned on the screen.",
      "Each card should have a letter (A, B, C etc.). The letter should be hidden and only revealed when the user clicks on the card. Every letter should have a pair on an other card (so if there is a card with an A, there should be a second A somewhere else, but not more).",
      "If two cards are revealed and the letters match, the cards should turn green and be removed from the screen after half a second.",
      "If the letters mismatch, they should turn red and the letters should be hidden after half a second.",
      "There should be a score counter on the top right starting from zero. Add one score whenever the user successfully reveals a pair.",
      'Add a "You won!" text to the middle of the screen when all pairs have been found.',
    ],
  },
];

export const getTaskDescription = (
  key: ExperimentTask
): TaskDescription | undefined => tasks.filter((task) => task.key === key)?.[0];
