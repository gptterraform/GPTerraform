import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

const getPrimaryButton = (theme: any) => {
  return `
        background-color: ${theme.colors.accent.normal};
        color: white;
        border: 1px solid ${theme.colors.accent.normal};
        &:hover {
            background-color: ${theme.colors.accent.hover};
            border-color: ${theme.colors.accent.hover};
        }
    `;
};

const dangerButton = `
    background-color: #d03131;
    color: white;
    border: 1px solid #d03131;
    &:hover {
        background-color: #a00;
        border-color: #a00;
    }
`;

const SendButton = styled.button<{
  disabled?: boolean;
  $buttonSize: ButtonSize;
  $buttonType: ButtonType;
  $narrow: boolean;
}>`
  border: none;
  outline: none;
  padding: 0.5rem ${(props) => (props.$narrow ? "1rem" : "2rem")};
  border-radius: 0.5rem;
  ${(props) => {
    switch (props.$buttonType) {
      case "primary":
        return getPrimaryButton(props.theme);
      case "danger":
        return dangerButton;
    }
  }}
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.15s;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  &:hover {
    ${(props) => props.disabled && "opacity: 0.7;"}
  }

  ${(props) =>
    props.$buttonSize === "large" && "font-size: 1rem; padding: 1rem 2.5rem;"}
`;

const RippleContainer = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
`;

const Ripple = styled.div`
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  &:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 8.5px;
      left: 8.5px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: -1px;
      left: -1px;
      width: 17.5px;
      height: 17.5px;
      opacity: 0;
    }
  }
`;

export type ButtonSize = "small" | "medium" | "large";
export type ButtonType = "primary" | "danger";

type ButtonProps = {
  isLoading?: boolean;
  buttonSize?: ButtonSize;
  buttonType?: ButtonType;
  narrow?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  isLoading,
  onClick,
  children,
  buttonSize = "medium",
  buttonType = "primary",
  narrow = false,
  ...rest
}: ButtonProps) => {
  return (
    <SendButton
      onClick={onClick}
      disabled={isLoading}
      $buttonSize={buttonSize}
      $buttonType={buttonType}
      $narrow={narrow}
      {...rest}
    >
      {isLoading ? (
        <RippleContainer>
          <Ripple />
          <Ripple />
        </RippleContainer>
      ) : (
        children
      )}
    </SendButton>
  );
};

export default Button;
