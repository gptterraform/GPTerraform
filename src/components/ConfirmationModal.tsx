import styled from "styled-components";
import CloseIcon from "../assets/close.svg";
import Button from "./Button";
import CheckIcon from "../assets/check.svg";

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
  justify-content: center;
  padding: 1rem;
  width: 20vw;
  padding: 2rem;
  padding-top: 2.5rem;
  padding-bottom: 1rem;
  background-color: ${(props) => props.theme.colors.backgroundLight};
  color: ${(props) => props.theme.colors.browserColor};
  border-radius: 10px;
  position: relative;
`;

const Title = styled.span`
  font-size: 1rem;
  text-align: center;
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

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: calc(100% - 2rem);
  gap: 1rem;
  padding: 1rem;
`;

const CheckIconImage = styled.img`
  width: 3rem;
  height: 3rem;
  margin: -0.9rem;
`;

type SuggestionOverlayProps = {
  cancel: () => void;
  confirm: () => void;
  text: string;
};

const ConfirmationModal = ({
  cancel,
  confirm,
  text,
}: SuggestionOverlayProps) => {
  return (
    <Container>
      <ContentContainer>
        <CloseButton onClick={cancel}>
          <CloseIconImage src={CloseIcon} />
        </CloseButton>
        <Title>{text}</Title>
        <ButtonRow>
          <Button onClick={cancel} buttonType="danger">
            <CloseIconImage src={CloseIcon} />
          </Button>
          <Button onClick={confirm}>
            <CheckIconImage src={CheckIcon} />
          </Button>
        </ButtonRow>
      </ContentContainer>
    </Container>
  );
};

export default ConfirmationModal;
