import { Editor } from "@monaco-editor/react";
import { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { CompletionMessage } from "../services/gpt";
import Button from "./Button";
import CheckIcon from "../assets/check.svg";
import ChatMessage from "./ChatMessage";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { useStore } from "../store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 30vw;
`;

const ContentContainer = styled.div<{ $isHovering: boolean }>`
  display: flex;
  flex-direction: row;
  height: 50vh;
  width: 30vw;
  transition: width 0.15s, height 0.15s;
  ${(props) => props.$isHovering && "width: 90vw; height: 80vh; z-index: 3;"}
`;

const SuggestionBrowser = styled.iframe`
  position: relative;
  background-color: white;
  border: none;
  color: ${(props) => props.theme.colors.browserColor};
  width: calc(15vw - 1rem);
  flex: 1;
  height: 100%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  overflow: auto;
`;

const EditorContainer = styled.div`
  flex: 1;
  height: calc(100% - 1rem);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.backgroundLight};
`;

const CheckIconImage = styled.img`
  width: 3rem;
  height: 3rem;
  margin: -0.5rem;
`;

const BottomContainer = styled.div<{ $expanded?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$expanded ? "row" : "column")};
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

type SuggestionProps = {
  completion: CompletionMessage;
  outsideHovering: boolean;
  indicateHovering: (hovering: boolean) => void;
  index: number;
  accept: (completion: CompletionMessage) => void;
};

const Suggestion = ({
  completion,
  indicateHovering,
  accept,
}: SuggestionProps) => {
  const [hovering, setHovering] = useState(false);
  const [outTimeout, setOutTimeout] = useState<NodeJS.Timeout>();
  const inside = useRef(false);
  const [html, setHtml] = useState(completion.html);
  const themeSelection = useStore((state) => state.theme);

  const startHovering = useCallback(() => {
    inside.current = true;
    clearTimeout(outTimeout);

    setTimeout(() => {
      if (!inside.current) return;

      setHovering(true);
      indicateHovering(true);
    }, 200);
  }, [indicateHovering, inside, outTimeout]);

  const startLeave = () => {
    inside.current = false;
    setOutTimeout(
      setTimeout(() => {
        if (inside.current) return;

        setHovering(false);
        indicateHovering(false);
      }, 200)
    );
  };

  const message: ChatCompletionMessageParam = useMemo(() => {
    return {
      role: "assistant",
      content: completion.explanation,
    };
  }, [completion.explanation]);

  const onAccept = useCallback(() => {
    return accept({
      ...completion,
      html,
    });
  }, [accept, completion, html]);

  return (
    <Container onMouseLeave={startLeave}>
      <ContentContainer $isHovering={hovering} onMouseEnter={startHovering}>
        <SuggestionBrowser srcDoc={completion.html} />
        <EditorContainer>
          <Editor
            value={html}
            onChange={(value) => setHtml(value ?? "")}
            height="100%"
            width={hovering ? "45vw" : "15vw"}
            defaultLanguage="html"
            theme={themeSelection === "dark" ? "vs-dark" : "light"}
          />
        </EditorContainer>
      </ContentContainer>

      <BottomContainer $expanded={hovering}>
        <ChatMessage nextIsSame={true} message={message} />

        <Button onClick={onAccept} style={{ marginTop: 0 }}>
          <CheckIconImage src={CheckIcon} />
        </Button>
      </BottomContainer>
    </Container>
  );
};

export default Suggestion;
