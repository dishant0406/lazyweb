import { forwardRef, memo } from "react";

import { Theme } from "../index.types";

import styles from "../styles/EditorLineNumbers.module.css";

type EditorLineNumbersProps = {
  lineCount: number;
  showLineNumbers: boolean;
  theme: Theme;
};

const EditorLineNumbers = forwardRef<HTMLPreElement, EditorLineNumbersProps>(
  ({ lineCount, showLineNumbers, theme }, ref) => {
    if (!showLineNumbers) return null;

    return (
      <pre
        className={styles.editorLineNumbers}
        ref={ref}
        style={{
          fontSize: theme.fontSize,
          borderRight: theme.numbersBorder,
          backgroundColor: theme.numbersBackgroundColor,
          color: theme.numbersColor,
        }}
        aria-hidden={true}
      >
        {Array.from({ length: lineCount }, (_, i) => i + 1).join("\n") + "\n\n"}
      </pre>
    );
  }
);

EditorLineNumbers.displayName = "EditorLineNumbers";

export default memo(EditorLineNumbers);
