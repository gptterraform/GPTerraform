import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CompletionMessage } from "../services/gpt";
import Suggestion from "./Suggestion";
import Button from "./Button";
import CloseIcon from "../assets/close.svg";
import { Tooltip } from "react-tooltip";
import { useTour } from "@reactour/tour";

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
  gap: 1rem;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const BrowserContainer = styled.div<{
  $position: "first" | "last" | "middle";
  $number: number;
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  transform: translateX(
    ${(props) => {
      switch (props.$position) {
        case "first":
          return props.$number === 2 ? "15vw" : "30vw";
        case "last":
          return props.$number === 2 ? "-15vw" : "-30vw";
        case "middle":
          return "0";
      }
    }}
  );
`;

const CloseIconImage = styled.img`
  width: 1rem;
  height: 1rem;
`;

type SuggestionOverlayProps = {
  suggestions: CompletionMessage[];
  close: (completion: CompletionMessage | null) => void;
};

const SuggestionOverlay = ({ suggestions, close }: SuggestionOverlayProps) => {
  const [hovering, setHovering] = useState<number | null>(null);
  const { isOpen, setCurrentStep } = useTour();
  const position = useMemo(() => {
    if (suggestions.length === 1) return "middle";

    if (hovering === 0) return "first";
    if (hovering === suggestions.length - 1) return "last";

    return "middle";
  }, [hovering, suggestions.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(9);
    }
  }, [setCurrentStep]);

  const finish = useCallback(
    (message: CompletionMessage | null) => {
      close(message);
      if (isOpen) {
        setCurrentStep(10);
      }
    },
    [close, isOpen, setCurrentStep]
  );

  return (
    <>
      <Tooltip
        id="dismiss-tooltip"
        opacity={1}
        noArrow
        style={{ zIndex: 999 }}
      />
      <Container id="tour-suggestions">
        <Button
          buttonSize="large"
          buttonType="danger"
          onClick={() => close(null)}
          data-tooltip-content="Dismiss all suggestions"
          data-tooltip-id="dismiss-tooltip"
          data-tooltip-variant="dark"
        >
          <CloseIconImage src={CloseIcon} />
        </Button>

        <BrowserContainer $position={position} $number={suggestions.length}>
          {suggestions.map((completion, index) => (
            <Suggestion
              key={index}
              completion={completion}
              indicateHovering={(h) => setHovering(h ? index : null)}
              outsideHovering={!!hovering}
              index={index}
              accept={finish}
            />
          ))}
        </BrowserContainer>
      </Container>
    </>
  );
};

export default SuggestionOverlay;
