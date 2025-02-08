import { useCallback } from 'react';

export default (tabWidth: number) => {
  const insertTab = useCallback(
    (code: string, start: number, end: number): [string, number, number] => {
      const startSub = code.substring(0, start);
      const endSub = code.substring(end);

      return [ startSub + ' '.repeat(tabWidth) + endSub, start + tabWidth, end + tabWidth ];
    },
    [ tabWidth ]
  );

  const indentLine = useCallback(
    (code: string, start: number, end: number): [string, number, number] => {
      const codeBeforeStart = code.substring(0, start);
      const startLine = (codeBeforeStart.match(/\n/g) || []).length;
      const lines = code.split('\n');
      const line = lines[startLine];
      const regex = new RegExp(`^ {0,${tabWidth}}`);
      const match = line.match(regex);
      const spaceCount = match![0].length;

      if (spaceCount === 0) return [ code, start, end ];
      lines[startLine] = line.replace(regex, '');
      return [ lines.join('\n'), start - spaceCount, end - spaceCount ];
    },
    [ tabWidth ]
  );

  const getBlocks = useCallback(
    (code: string, start: number, end: number): [string[], string[], string[]] => {
      const lines = code.split('\n');
      const codeBeforeStart = code.substring(0, start);
      const startLine = (codeBeforeStart.match(/\n/g) || []).length;
      const startSlice = lines.slice(0, startLine);
      const codeBeforeEnd = code.substring(0, end);
      const endLine = (codeBeforeEnd.match(/\n/g) || []).length;
      const endSlice = lines.slice(endLine + 1);
      const block = lines.slice(startLine, endLine + 1);

      return [ startSlice, block, endSlice ];
    },
    []
  );

  const indentBlock = useCallback(
    (code: string, start: number, end: number): [string, number, number] => {
      const [ startSlice, block, endSlice ] = getBlocks(code, start, end);
      let newStart = start;
      let newEnd = end;
      const indentSpaces = ' '.repeat(tabWidth);
      const indentSlice = block.map((line, index) => {
        if (index === 0) newStart += tabWidth;
        newEnd += tabWidth;
        return `${indentSpaces}${line}`;
      });

      return [ [ ...startSlice, ...indentSlice, ...endSlice ].join('\n'), newStart, newEnd ];
    },
    [ tabWidth ]
  );

  const outdentBlock = useCallback(
    (code: string, start: number, end: number): [string, number, number] => {
      const [ startSlice, block, endSlice ] = getBlocks(code, start, end);
      let newStart = start;
      let newEnd = end;
      const indentSlice = block.map((line, index) => {
        const regex = new RegExp(`^ {0,${tabWidth}}`);
        const match = line.match(regex);
        const spaceCount = match![0].length;

        if (spaceCount === 0) return line;
        if (index === 0) newStart -= spaceCount;
        newEnd -= spaceCount;
        return line.replace(regex, '');
      });

      return [ [ ...startSlice, ...indentSlice, ...endSlice ].join('\n'), newStart, newEnd ];
    },
    [ tabWidth ]
  );

  return useCallback(
    (code: string, start: number, end: number, isShift: boolean): [string, number, number] => {
      if (start === end) {
        return isShift ? indentLine(code, start, end) : insertTab(code, start, end);
      }

      return isShift ? outdentBlock(code, start, end) : indentBlock(code, start, end);
    },
    [ insertTab, indentLine, indentBlock, outdentBlock ]
  );
};
