import { useCallback } from 'react';

export default (tabWidth = 2) => {
  return useCallback((code: string, start: number): [number, string, number] => {
    const beforeCursor = code.substring(0, start);
    const afterCursor = code.substring(start);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const currentIndent = currentLine?.match(/^ */)?.[0]?.length || 0;

    // Function to find the matching closing bracket
    const findMatchingBracket = (text: string, openBracket: string): number => {
      const closeBracket = { '{': '}', '[': ']', '(': ')' }[openBracket];
      let count = 1;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === openBracket) count++;
        if (text[i] === closeBracket) count--;
        if (count === 0) return i;
      }

      return -1;
    };

    // Check if we're inside brackets
    const openBracketMatch = /[{([]\s*$/.exec(beforeCursor);

    if (openBracketMatch) {
      const openBracket = openBracketMatch[0].trim();
      const closingIndex = findMatchingBracket(afterCursor, openBracket);

      if (closingIndex !== -1) {
        const newIndent = currentIndent + tabWidth;
        const closingBracket = afterCursor.substring(closingIndex, closingIndex + 1);

        const afterClosing = afterCursor.substring(closingIndex + 1);

        const newCode = beforeCursor + '\n' +
                      ' '.repeat(newIndent) + '\n' +
                      ' '.repeat(currentIndent) + closingBracket +
                      afterClosing;

        const newCursorPosition = start + newIndent + 1; // +1 for the newline character

        return [ lines.length + 1, newCode, newCursorPosition ];
      }
    }

    // If not inside brackets, just add a new line with the same indentation
    const newCode = beforeCursor + '\n' + ' '.repeat(currentIndent) + afterCursor;
    const newCursorPosition = start + currentIndent + 1; // +1 for the newline character

    return [ lines.length + 1, newCode, newCursorPosition ];
  }, [ tabWidth ]);
};
