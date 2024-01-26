import { useMemo } from "react";
import styled from "styled-components";
import CloseIcon from "../assets/close.svg";
import { SupportedLlm, useStore } from "../store";
import MoonIcon from "../assets/moon.svg";
import SunIcon from "../assets/sun.svg";
import LightningIcon from "../assets/lightning.svg";
import BrainIcon from "../assets/brain.svg";
import { ExperimentTask } from "../services/tasks";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  padding: 1rem;
  width: 40vw;
  padding: 2.5rem 0;
  background-color: ${(props) => props.theme.colors.backgroundLight};
  color: ${(props) => props.theme.colors.browserColor};
  border-radius: 10px;
  position: relative;
`;

const Title = styled.span`
  font-size: 1.7rem;
  font-weight: 600;
`;

const SettingTitle = styled.span`
  opacity: 0.7;
  font-size: 1.1rem;
  margin-top: 1rem;
`;

const SettingDescription = styled.span`
  color: ${(props) => props.theme.colors.settings.text};
  font-size: 0.9rem;
  opacity: 0.7;
`;

const SwitcherContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 13px;
`;

const SwitcherItem = styled.div<{ $isActive?: boolean }>`
  background-color: ${(props) =>
    props.$isActive
      ? props.theme.colors.backgroundLight
      : props.theme.colors.background};
  width: 5rem;
  margin: 3px;
  padding: 0.5rem;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.15s;
  user-select: none;

  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundLightPressed};
  }
`;

const ThemeIconImage = styled.img<{ $small?: boolean }>`
  width: ${(props) => (props.$small ? "1rem" : "1.2rem")};
  height: ${(props) => (props.$small ? "1rem" : "1.2rem")};
  margin-right: 0.5rem;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(0)" : "invert(1)"};
`;

const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s;
  &:hover {
    opacity: 1;
  }
`;

const CloseIconImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(0)" : "invert(1)"};
`;

type SuggestionOverlayProps = {
  close: () => void;
};

type SettingItem<T> = {
  key: T;
  icon?: any;
  name: string;
  description?: string;
};

const SettingsOverlay = ({ close }: SuggestionOverlayProps) => {
  const themeSelection = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const llm = useStore((state) => state.llm);
  const setLlm = useStore((state) => state.setLlm);

  const experimentTask = useStore((state) => state.experimentTask);
  const setExperimentTask = useStore((state) => state.setExperimentTask);

  const llmList: SettingItem<SupportedLlm>[] = useMemo(() => {
    return [
      {
        key: "gpt-3.5-turbo-1106",
        icon: LightningIcon,
        name: "GPT-3",
        description: "Faster response times, less accurate responses.",
      },
      {
        key: "gpt-4-1106-preview",
        icon: BrainIcon,
        name: "GPT-4",
        description: "Slower response times, more accurate respones.",
      },
    ];
  }, []);

  const taskList: SettingItem<ExperimentTask>[] = useMemo(() => {
    return [
      {
        key: "none",
        name: "None",
      },
      {
        key: "camera",
        name: "Camera",
      },
      {
        key: "researcher",
        name: "Researcher",
      },
      {
        key: "memory",
        name: "Memory",
      },
    ];
  }, []);

  return (
    <>
      <Container>
        <ContentContainer>
          <CloseButton onClick={close}>
            <CloseIconImage src={CloseIcon} />
          </CloseButton>
          <Title>Settings</Title>
          <SettingTitle>Theme</SettingTitle>
          <SwitcherContainer>
            <SwitcherItem
              $isActive={themeSelection === "light"}
              onClick={toggleTheme}
            >
              <ThemeIconImage src={SunIcon} />
              Light
            </SwitcherItem>
            <SwitcherItem
              $isActive={themeSelection === "dark"}
              onClick={toggleTheme}
            >
              <ThemeIconImage src={MoonIcon} $small />
              Dark
            </SwitcherItem>
          </SwitcherContainer>

          <SettingTitle>Language model</SettingTitle>
          <SwitcherContainer>
            {llmList.map(({ key, icon, name }) => (
              <SwitcherItem $isActive={llm === key} onClick={() => setLlm(key)}>
                <ThemeIconImage src={icon} />
                {name}
              </SwitcherItem>
            ))}
          </SwitcherContainer>
          <SettingDescription>
            {llmList.find(({ key }) => key === llm)?.description}
          </SettingDescription>

          <SettingTitle>Experiment task</SettingTitle>
          <SwitcherContainer>
            {taskList.map(({ key, icon, name }) => (
              <SwitcherItem
                $isActive={experimentTask === key}
                onClick={() => setExperimentTask(key)}
              >
                {icon && <ThemeIconImage src={icon} />}
                {name}
              </SwitcherItem>
            ))}
          </SwitcherContainer>
        </ContentContainer>
      </Container>
    </>
  );
};

export default SettingsOverlay;
