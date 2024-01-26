import { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import SettingsIcon from "../assets/settings.svg";
import CloseIcon from "../assets/close.svg";
import HtmlIcon from "../assets/html.svg";
import ResetIcon from "../assets/reset.svg";
import TaskIcon from "../assets/task.svg";
import ConfirmationModal from "./ConfirmationModal";
import { useStore } from "../store";
import { useTour } from "@reactour/tour";
import TaskOverlay from "./TaskOverlay";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 2rem;
  width: calc(100% - 2rem);
  margin: 1rem;
  margin-bottom: -1rem;
  background-color: ${(props) => props.theme.colors.tabs.background};
  border-radius: 10px 10px 0px 0px;
  overflow: hidden;
`;

const Tab = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.5rem;
  min-width: 10rem;
  height: 2rem;
  font-size: 0.9rem;
  background-color: ${(props) => props.theme.colors.backgroundLight};
  color: ${(props) => props.theme.colors.tabText};
`;

const TabText = styled.span``;

const ActionContainer = styled.div<{ $marginLeft?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.$marginLeft && "margin-left: auto;"}
  background-color: ${(props) => props.theme.colors.backgroundLight};
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundLightPressed};

    & > img {
      animation: rotation 3s linear infinite;
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const SettingsIconImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(0)" : "invert(1)"};
`;

const ResetIconImage = styled.img`
  width: 1rem;
  height: 1rem;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(0)" : "invert(1)"};
`;

const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  margin-left: auto;
  border-radius: 100px;
  background-color: ${(props) => props.theme.colors.backgroundLightPressed};
`;

const CloseIconImage = styled.img`
  width: 0.6rem;
  height: 0.6rem;
  opacity: 0.6;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(0)" : "invert(1)"};
`;

const HtmlIconImage = styled.img`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;

const TaskIconImage = styled.img`
  width: 1rem;
  height: 1rem;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(0)" : "invert(1)"};
`;

type TabsProps = {
  openSettings: () => void;
};

const Tabs = ({ openSettings }: TabsProps) => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const resetState = useStore((state) => state.reset);
  const { isOpen: isTourOpen, setIsOpen: setTourIsOpen } = useTour();
  const taskRef = useRef<HTMLDivElement>(null);
  const [showTasks, setShowTasks] = useState(false);

  const reset = useCallback(() => {
    resetState();
    setResetModalOpen(false);
  }, [resetState]);

  const startReset = useCallback(() => {
    if (isTourOpen) {
      setTourIsOpen(false);
    }
    setResetModalOpen(true);
  }, [isTourOpen, setTourIsOpen]);

  return (
    <Container>
      <Tab>
        <HtmlIconImage src={HtmlIcon} />
        <TabText>index.html</TabText>
        <CloseButton>
          <CloseIconImage src={CloseIcon} />
        </CloseButton>
      </Tab>

      <TaskOverlay
        visible={showTasks}
        top={taskRef.current?.getBoundingClientRect().bottom}
        left={taskRef.current?.getBoundingClientRect().left}
      />

      <ActionContainer
        ref={taskRef}
        $marginLeft
        onClick={() => setShowTasks((prev) => !prev)}
      >
        <TaskIconImage src={TaskIcon} />
      </ActionContainer>
      <ActionContainer id="tour-reset" onClick={startReset}>
        <ResetIconImage src={ResetIcon} />
      </ActionContainer>
      <ActionContainer id="tour-settings" onClick={openSettings}>
        <SettingsIconImage src={SettingsIcon} />
      </ActionContainer>

      {resetModalOpen && (
        <ConfirmationModal
          cancel={() => setResetModalOpen(false)}
          confirm={reset}
          text="Are you sure you want to reset the editor and conversation?"
        />
      )}
    </Container>
  );
};

export default Tabs;
