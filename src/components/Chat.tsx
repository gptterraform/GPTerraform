import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import ChatMessage from "./ChatMessage";
import SendIcon from "../assets/send.svg";
import CloseIcon from "../assets/close.svg";
import SelectIcon from "../assets/select.svg";
import BrainIcon from "../assets/brain.svg";
import CreateIcon from "../assets/create.svg";
import { PromptStage, RequestType } from "../services/gpt";
import { Tooltip } from "react-tooltip";
import Button from "./Button";
import { useStore } from "../store";
import { useTour } from "@reactour/tour";
import Dropdown, { DropdownOption } from "./Dropdown";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: hidden;
  width: calc(100% - 2rem);
  padding: 0.5rem;
  margin: 1rem;
  background-color: ${(props) => props.theme.colors.backgroundLight};
  border-radius: 10px;
  height: 100%;
  max-height: 40vh;
  position: relative;
`;

const ChatMessageList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0rem;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 1rem;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 1;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: 100%;
`;

const TextArea = styled.textarea`
  height: 3rem;
  border: none;
  outline: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: 100%;
  background-color: ${(props) => props.theme.colors.input.background};
  border: 1px solid ${(props) => props.theme.colors.input.border};
  margin-right: 0.5rem;
  transition: border-color 0.15s;
  color: ${(props) => props.theme.colors.input.text};
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.input.borderFocused};
  }
  resize: none;
`;
const SendIconImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const InputStage = styled.span`
  color: #656565;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const Highlight = styled.div<{
  $isActive?: boolean;
  $isHighlighting?: boolean;
}>`
  background-color: ${(props) =>
    props.$isActive
      ? props.theme.colors.highlightColor
      : props.theme.colors.input.background};
  border: 1px solid
    ${(props) =>
      props.$isActive
        ? props.theme.colors.highlightColor
        : props.theme.colors.input.border};
  ${(props) =>
    props.$isHighlighting
      ? `background-color: ${props.theme.colors.highlightColor};`
      : ""}
  ${(props) =>
    props.$isHighlighting
      ? `border-color: ${props.theme.colors.highlightColor};`
      : ""}
  border-radius: 4px;
  min-width: 3rem;
  width: 3rem;
  height: 3rem;
  margin-right: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.15s;
  > img {
    ${(props) => {
      if (props.theme.lightSelectIcon) {
        return props.$isActive ? "" : "filter: invert(1);";
      }
      return props.$isHighlighting ? "filter: invert(1);" : "";
    }}
  }
  &:hover {
    background-color: ${(props) =>
      props.$isActive
        ? props.theme.highlightPressed
        : props.theme.colors.backgroundLightPressed};
    border-color: ${(props) =>
      props.$isActive
        ? props.theme.colors.highlight
        : props.theme.colors.backgroundLightPressed};
    ${(props) =>
      props.$isHighlighting
        ? `background-color: ${props.theme.colors.highlightPressed}; border-color: ${props.theme.colors.highlightPressed};`
        : ""}
    > img {
      opacity: 1;
    }
  }
`;

const CloseIconImage = styled.img`
  width: 1rem;
  height: 1rem;
`;

const SelectIconImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

type ChatProps = {
  send: (
    input: string,
    requestType: RequestType,
    tourStep?: number
  ) => Promise<void>;
  stage: PromptStage;
  highlighted: HTMLElement | null;
  unhighlight: () => void;
  highlighting: boolean;
  toggleHighlighting: () => void;
};

const requestOptions: DropdownOption[] = [
  { name: "Explain", value: "explain", icon: BrainIcon },
  { name: "Change", value: "change", icon: CreateIcon },
];

const Chat = ({
  send,
  stage,
  highlighted,
  unhighlight,
  highlighting,
  toggleHighlighting,
}: ChatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const zMessages = useStore((state) => state.messages);
  const revert = useStore((state) => state.revertToMessage);
  const { setCurrentStep, currentStep, isOpen } = useTour();
  const [requestOption, setRequestOption] = useState<DropdownOption>(
    requestOptions[1]
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextAreaHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto"; // Reset height to recalculate
      textArea.style.height = textArea.scrollHeight + "px"; // Set new height
    }
  };

  useEffect(() => {
    adjustTextAreaHeight();
  }, [input]);

  const revertAction = useCallback(
    (index: number) => {
      if (index === 1 && isOpen) {
        setCurrentStep(11);
      }
      revert(index);
    },
    [isOpen, revert, setCurrentStep]
  );

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  }, [zMessages.length]);

  const onSend = async () => {
    if (input === "" || loading) return;

    setLoading(true);
    setInput("");

    if (isOpen && currentStep === 7) {
      setCurrentStep(currentStep + 1);
      await send(input, requestOption.value as RequestType, currentStep);
    } else if (isOpen && currentStep === 12) {
      setCurrentStep(currentStep + 1);
      await send(input, requestOption.value as RequestType);
    } else {
      await send(input, requestOption.value as RequestType);
    }
    setLoading(false);
  };

  const stageText = useMemo(() => {
    switch (stage) {
      case "idle":
        return "";
      case "appropriateness":
        return "Checking appropriateness...";
      case "completion":
        return "Writing code...";
      case "formatting":
        return "Formatting code...";
      case "suggestions":
        return "Generating suggestions...";
      case "pruning-suggestions":
        return "Pruning suggestions...";
      case "explaining":
        return "Generating explanation...";
      default:
        return "";
    }
  }, [stage]);

  const highlightClick = () => {
    if (!highlighted) {
      toggleHighlighting();
      if (currentStep === 4 && isOpen) {
        setCurrentStep(5);
      }
    } else {
      unhighlight();
    }
  };

  const onRequestOptionSelect = (option: DropdownOption) => {
    if (isOpen && currentStep === 11 && option.value === "explain") {
      setCurrentStep(currentStep + 1);
    }
    setRequestOption(option);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line on Enter
      onSend();
    }
  };

  return (
    <ChatContainer id="tour-chat">
      <ChatMessageList>
        {zMessages.map((message, index) => (
          <ChatMessage
            message={message.message}
            key={index}
            nextIsSame={
              index < zMessages.length - 1 &&
              zMessages[index + 1].message.role ===
                zMessages[index].message.role
            }
            onRevert={() => revertAction(index)}
          />
        ))}
        <div ref={ref} />
      </ChatMessageList>

      <InputContainer>
        <InputStage>{stageText}</InputStage>
        <InputRow>
          <Highlight
            id="tour-highlight"
            data-tooltip-id="highlight-tooltip"
            data-tooltip-content={
              highlighted
                ? "Unselect element"
                : highlighting
                ? "Stop selection"
                : "Select an element"
            }
            data-tooltip-variant="dark"
            onClick={highlightClick}
            $isActive={!!highlighted}
            $isHighlighting={highlighting}
          >
            {highlighted ? (
              <CloseIconImage src={CloseIcon} />
            ) : (
              <SelectIconImage src={SelectIcon} />
            )}
          </Highlight>

          <TextArea
            rows={1}
            ref={textAreaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeyUp}
            placeholder="Ask the AI..."
          />
          <Dropdown
            currentValue={requestOption}
            options={requestOptions}
            onSelected={onRequestOptionSelect}
          />
          <Button
            onClick={onSend}
            isLoading={loading}
            narrow
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              height: "calc(3rem + 2px)",
            }}
          >
            <SendIconImage src={SendIcon} />
          </Button>
        </InputRow>
      </InputContainer>
      <Tooltip id="highlight-tooltip" opacity={1} noArrow />
    </ChatContainer>
  );
};

export default Chat;
