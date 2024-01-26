import { useCallback, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: flex;
  color: ${(props) => props.theme.colors.browserColor};
  height: calc(3rem + 2px);
`;

const SelectedContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 0.5rem 1rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  width: 5rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors.input.border};
  background-color: ${(props) => props.theme.colors.input.background};
  transition: background-color 0.15s;
  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundLightPressed};
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  background-color: ${(props) => props.theme.colors.input.background};
  border: 1px solid ${(props) => props.theme.colors.input.border};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 1;
  margin-bottom: 0.5rem;
`;

const DropdownOptionContainer = styled.div`
  padding: 0.7rem 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: background-color 0.15s;
  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundLightPressed};
  }
`;

const IconImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
  filter: ${(props) =>
    props.theme.lightSelectIcon ? "invert(0)" : "invert(1)"};
`;

export interface DropdownOption {
  name: string;
  value: string;
  icon: any;
}

type DropdownProps = {
  currentValue: DropdownOption;
  options: DropdownOption[];
  onSelected: (option: DropdownOption) => void;
};

const Dropdown = ({ currentValue, options, onSelected }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const select = useCallback(
    (option: DropdownOption) => {
      setIsOpen(false);
      onSelected(option);
    },
    [onSelected]
  );

  return (
    <Container id="tour-dropdown">
      <SelectedContainer onClick={() => setIsOpen((prev) => !prev)}>
        <IconImage src={currentValue.icon} />
        {currentValue.name}
      </SelectedContainer>
      {isOpen && (
        <DropdownContainer>
          {options.map((option) => (
            <DropdownOptionContainer onClick={() => select(option)}>
              {option.icon && <IconImage src={option.icon} />}
              {option.name}
            </DropdownOptionContainer>
          ))}
        </DropdownContainer>
      )}
    </Container>
  );
};

export default Dropdown;
