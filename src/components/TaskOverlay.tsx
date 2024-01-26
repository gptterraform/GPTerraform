import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useStore } from "../store";
import { getTaskDescription } from "../services/tasks";
import { defaultHtml } from "../services/htmls";

const Container = styled.div<{ top?: number; left?: number }>`
  position: absolute;
  top: ${(props) => (props.top ?? 0) + 5}px;
  left: ${(props) => (props.left ?? 0) - 500}px;
  background-color: ${(props) => props.theme.colors.backgroundLight};
  padding: 1rem;
  border-radius: 10px;
  z-index: 1;
  color: ${(props) => props.theme.colors.browserColor};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
  width: 500px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
`;

const TaskList = styled.ul``;

const TaskItem = styled.li`
  margin-bottom: 0.5rem;
`;

type TaskOverlayProps = {
  visible: boolean;
  top?: number;
  left?: number;
};

const TaskOverlay = ({ visible, top, left }: TaskOverlayProps) => {
  const experimentTask = useStore((state) => state.experimentTask);
  const changeHtml = useStore((state) => state.changeHtml);

  const taskDescription = useMemo(() => {
    return getTaskDescription(experimentTask);
  }, [experimentTask]);

  useEffect(() => {
    if (taskDescription?.html) {
      changeHtml(taskDescription.html);
    } else {
      changeHtml(defaultHtml);
    }
  }, [changeHtml, taskDescription?.html]);

  if (!visible) {
    return null;
  }

  return (
    <Container top={top} left={left}>
      <Title>{taskDescription?.name}</Title>
      <TaskList>
        {taskDescription?.tasks.map((task, index) => (
          <TaskItem key={index}>{task}</TaskItem>
        ))}
      </TaskList>
    </Container>
  );
};

export default TaskOverlay;
