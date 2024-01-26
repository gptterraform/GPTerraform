import { ChatCompletionMessageParam } from "openai/resources/chat";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import ChatGptIcon from "../assets/chatgpt-icon.png";
import UndoIcon from "../assets/undo.svg";
import { useSpring, animated } from "@react-spring/web";

const ChatMessageContainer = styled(animated.div)<{
  $isOwn?: boolean;
  $nextIsSame?: boolean;
}>`
  ${(props) => (props.$isOwn ? "margin-left: auto;" : "")}
  max-width: calc(80% - 1rem);
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: ${(props) => (props.$nextIsSame ? "4px" : "1rem")};
  position: relative;
  overflow-wrap: break-word;
`;

const Message = styled.div<{ $isOwn?: boolean }>`
  ${(props) =>
    !props.$isOwn
      ? `background-color: ${props.theme.colors.message.ai.background}; color: ${props.theme.colors.message.ai.text}; cursor: pointer;`
      : `background-color: ${props.theme.colors.message.own.background}; color: ${props.theme.colors.message.own.text};`}
  border-radius: 4px;
  padding: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  white-space: pre-line;
`;

const ProfilePicture = styled.img`
  width: 2.3rem;
  height: 2.3rem;
`;

const RevertMessage = styled.div`
  position: absolute;
  right: -27%;
  top: 50%;
  transform: translateY(-50%);
  max-width: 25%;
  font-size: 0.8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.colors.browserColor};
  animation: fadein 0.3s;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.7;
    }
  }
`;

const UndoImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(1)" : "invert(0)"};
`;

type ChatMessageProps = {
  message: ChatCompletionMessageParam;
  nextIsSame: boolean;
  onRevert?: () => void;
};

const ChatMessage = ({ message, nextIsSame, onRevert }: ChatMessageProps) => {
  const isOwn = useMemo(() => message.role === "user", [message.role]);
  const [isReverting, setIsReverting] = useState(false);

  const springs = useSpring({
    from: { x: isOwn ? 200 : -200 },
    to: { x: 0 },
  });

  const onTryRevert = useCallback(() => {
    if (isOwn) return;

    if (isReverting) {
      setIsReverting(false);
      onRevert?.();
      return;
    }

    setIsReverting(true);
  }, [isReverting, onRevert]);

  return (
    <ChatMessageContainer
      $isOwn={isOwn}
      style={springs}
      $nextIsSame={nextIsSame}
      onClick={onTryRevert}
    >
      {!isOwn ? <ProfilePicture src={ChatGptIcon} /> : null}
      <Message $isOwn={isOwn}>{message.content}</Message>
      {!isOwn && isReverting && (
        <RevertMessage>
          <UndoImage src={UndoIcon} /> Press again to revert here
        </RevertMessage>
      )}
    </ChatMessageContainer>
  );
};

export default ChatMessage;
