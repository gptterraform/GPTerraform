import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { useStore } from "../store";

const Container = styled.iframe<{ $isHighlighting?: boolean }>`
  position: relative;
  width: calc(100% - 1rem);
  margin: 1rem;
  margin-bottom: 0;
  border-radius: 10px;
  height: 60vh;
  overflow: auto;
  background-color: white;
  color: ${(props) => props.theme.colors.browserColor};
  border: none;
  * {
    border: 1px solid transparent;
    &:hover {
      ${(props) =>
        props.$isHighlighting &&
        `border: 1px solid ${props.theme.colors.highlightColor};`}
    }
  }
`;

type BrowserProps = {
  html: string;
  highlight: (element: HTMLElement) => void;
  isHighlighting: boolean;
};

const styleElementId = "gpterraform-highlight-style";

const Browser = ({ html, highlight, isHighlighting }: BrowserProps) => {
  const [cursor, setCursor] = useState("default");
  const theme = useTheme();
  const currentHtml = useStore((state) => state.currentHtml);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const root = document.querySelector(":root") as HTMLElement;
    root?.style.setProperty("--highlight-color", theme.colors.highlightColor);
  }, [theme]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument?.head) return;

    const highlightListener = (event: MouseEvent) => {
      highlight(event?.target as HTMLElement);
    };

    const handleLoad = () => {
      let styleElement =
        iframe?.contentDocument?.getElementById(styleElementId);

      if (!styleElement) {
        styleElement = iframe.contentDocument?.createElement(
          "style"
        ) as HTMLStyleElement;
        (styleElement as HTMLStyleElement).type = "text/css";
        styleElement.id = styleElementId;
        iframe.contentDocument?.head.appendChild(styleElement);
      }

      styleElement.innerHTML = isHighlighting
        ? `*:hover { outline: 2px solid orange; }`
        : "";

      iframe.contentWindow?.document.body.removeEventListener(
        "click",
        highlightListener
      );

      iframe.contentWindow?.document.body.addEventListener(
        "click",
        highlightListener
      );
    };

    handleLoad();

    iframe.addEventListener("load", handleLoad);

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [highlight, isHighlighting, theme.colors.highlightColor]);

  useEffect(() => {
    setCursor(isHighlighting ? "crosshair" : "default");
  }, [isHighlighting]);

  return (
    <Container
      ref={iframeRef}
      id="tour-browser"
      srcDoc={currentHtml}
      onClick={(e) => isHighlighting && highlight(e.target as HTMLElement)}
      style={{ cursor }}
      $isHighlighting={isHighlighting}
    ></Container>
  );
};

export default Browser;
