import { forwardRef, RefObject, useMemo } from "react";

import useHighlightRange from "../hooks/useHighlightRange";

import { Theme } from "../index.types";

import styles from "../styles/EditorDisplay.module.css";

type EditorDisplayProps = {
  code: string;
  highlight: (code: string) => string | JSX.Element | JSX.Element[];
  visibleLine: number;
  visibleLineCount: number;
  scrollWidth: number;
  theme: Theme;
};

const BUFFER_LINES = 500;

export default forwardRef<HTMLDivElement, EditorDisplayProps>((props, ref) => {
  const { code, highlight, visibleLine, visibleLineCount, scrollWidth, theme } =
    props;
  const { backgroundColor, color, fontSize } = theme;

  const lines = code.split("\n");
  const lineCount = lines.length;

  const effectiveVisibleLine = Math.max(0, visibleLine - BUFFER_LINES);
  const effectiveVisibleLineCount = visibleLineCount + 2 * BUFFER_LINES;

  const highlightRange = useHighlightRange(
    highlight,
    effectiveVisibleLine,
    effectiveVisibleLineCount
  );
  const [linesBefore, highlightedCode] = highlightRange(lines);

  const codeHeight = useMemo(() => lineCount * fontSize, [lineCount, fontSize]);
  const codeTop = useMemo(
    () => linesBefore * fontSize,
    [linesBefore, fontSize]
  );
  const isStringHighlight = typeof highlightedCode === "string";

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={styles.editorDisplay}
      style={{
        backgroundColor,
      }}
      aria-hidden={true}
    >
      <pre className={styles.editorDisplayPre} style={{ height: codeHeight }}>
        <code
          className={styles.editorDisplayCode}
          style={{
            width: scrollWidth + fontSize,
            color,
            top: codeTop,
          }}
          children={isStringHighlight ? undefined : highlightedCode}
          dangerouslySetInnerHTML={
            isStringHighlight
              ? {
                  __html: highlightedCode,
                }
              : undefined
          }
        />
      </pre>
    </div>
  );
});
