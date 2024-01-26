import { useCallback, useEffect, useState } from "react";
import "./App.css";
import styled, { ThemeProvider } from "styled-components";
import Editor from "@monaco-editor/react";
import Chat from "./components/Chat";
import {
  PromptStage,
  CompletionMessage,
  getGptResponse,
  RequestType,
  getExplanationResponse,
} from "./services/gpt";
import Browser from "./components/Browser";
import SuggestionOverlay from "./components/SuggestionOverlay";
import { useStore } from "./store";
import { darkTheme, lightTheme } from "./theme/themes";
import Tabs from "./components/Tabs";
import SettingsOverlay from "./components/SettingsOverlay";
import { useTour } from "@reactour/tour";
import { getFakeGtpResponse } from "./services/tour";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-height: 100vh;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
`;

const Column = styled.div`
  width: 50vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  border-radius: 0 0 10px 10px;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.backgroundLight};
`;
type Code = {
  key: string;
  code: string;
};

const monacoDarkTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#323232",
  },
};

function App() {
  const html = useStore((state) => state.currentHtml);
  const changeHtml = useStore((state) => state.changeHtml);
  const addZMessage = useStore((state) => state.addMessage);
  const [stage, setStage] = useState<PromptStage>("idle");
  const [highlighted, setHighlighted] = useState<HTMLElement | null>(null);
  const [editor, setEditor] = useState<any | null>(null);
  const [monaco, setMonaco] = useState<any | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [suggestions, setSuggestions] = useState<CompletionMessage[] | null>();
  const themeSelection = useStore((state) => state.theme);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isOpen, currentStep, setCurrentStep } = useTour();

  const send = async (
    input: string,
    requestType: RequestType,
    tourStep?: number
  ) => {
    try {
      addZMessage({ code: "", message: { role: "user", content: input } });
      let message: CompletionMessage[] | null = null;
      const selection = editor
        .getModel()
        .getValueInRange(editor.getSelection());

      if (typeof tourStep === "number") {
        message = await getFakeGtpResponse(
          tourStep,
          (s) => setStage(s),
          highlighted?.outerHTML ?? selection ?? ""
        );
      } else if (requestType === "explain") {
        const explainMessage = await getExplanationResponse(input, (s) =>
          setStage(s)
        );

        if (explainMessage) {
          addZMessage({
            code: html,
            message: {
              role: "assistant",
              content: explainMessage.explanation,
            },
          });
        }
      } else {
        message = await getGptResponse(
          input,
          (s) => setStage(s),
          highlighted?.outerHTML ?? ""
        );
      }

      if (message?.length === 1) {
        completeSuggestions(message[0]);
        setSuggestions(null);
      } else {
        setSuggestions(message);
      }
    } catch (error) {
      addZMessage({
        code: "",
        message: {
          role: "assistant",
          content: "There was an error completing this request: " + error,
        },
      });
    }
    setStage("idle");
  };

  useEffect(() => {
    if (monaco) {
      monaco?.editor?.defineTheme("custom-dark", monacoDarkTheme);
      monaco?.editor?.setTheme(
        themeSelection === "dark" ? "custom-dark" : "light"
      );
    }
  }, [monaco, themeSelection, html]);

  const highlight = (element: HTMLElement) => {
    if (!isHighlighting) return;

    let matches = editor?.getModel()?.findMatches(element.outerHTML);
    if (matches.length === 0) {
      matches = editor
        ?.getModel()
        ?.findMatches(element.outerHTML.replaceAll('"', "'"));
    }

    editor.setSelections(
      matches.map(
        (match: any) =>
          new monaco.Selection(
            match.range.startLineNumber,
            match.range.startColumn,
            match.range.endLineNumber,
            match.range.endColumn
          )
      )
    );
    if (matches.length > 0) {
      editor.revealLine(matches[0].range.startLineNumber);
    }
    if (matches.length > 0) {
      setHighlighted(element);
      setIsHighlighting(false);
      if (isOpen && currentStep === 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setHighlighted(null);
    }
  };
  const unHighlight = () => {
    editor.setSelection(new monaco.Selection(0, 0, 0, 0));

    setHighlighted(null);
  };

  const completeSuggestions = (completion: CompletionMessage | null) => {
    if (!completion) {
      addZMessage({
        code: html,
        message: {
          role: "assistant",
          content:
            "Suggestions dismissed, no changes were made. Please try again.",
        },
      });
      setSuggestions(null);
      return;
    }

    addZMessage(
      {
        code: completion.html,
        message: { role: "assistant", content: completion.explanation },
      },
      completion.html
    );
    changeHtml(completion.html);
    setIsHighlighting(false);
    setHighlighted(null);
    setSuggestions(null);
    editor.setSelection(new monaco.Selection(0, 0, 0, 0));
  };

  const onEditorChange = useCallback(
    (value?: string) => {
      changeHtml(value ?? "");
    },
    [changeHtml]
  );

  return (
    <ThemeProvider theme={themeSelection === "dark" ? darkTheme : lightTheme}>
      <Container>
        {suggestions && (
          <SuggestionOverlay
            suggestions={suggestions}
            close={completeSuggestions}
          />
        )}
        {settingsOpen && (
          <SettingsOverlay close={() => setSettingsOpen(false)} />
        )}
        <Column>
          <Browser
            html={html}
            highlight={highlight}
            isHighlighting={isHighlighting}
          />
          <Chat
            send={send}
            stage={stage}
            highlighted={highlighted}
            unhighlight={unHighlight}
            highlighting={isHighlighting}
            toggleHighlighting={() => setIsHighlighting((prev) => !prev)}
          />
        </Column>

        <Column id="tour-code">
          <Tabs openSettings={() => setSettingsOpen(true)} />
          <EditorContainer>
            <Editor
              onMount={(editor, monaco) => {
                setEditor(editor);
                setMonaco(monaco);
              }}
              width="100%"
              height="calc(100vh - 5rem)"
              defaultLanguage="html"
              defaultValue={html}
              value={html}
              onChange={onEditorChange}
              theme={themeSelection === "dark" ? "vs-dark" : "light"}
            />
          </EditorContainer>
        </Column>
      </Container>
    </ThemeProvider>
  );
}

export default App;
