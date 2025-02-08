import { useCallback, useMemo } from 'react';

export default () => {
  const insertChar = useCallback((value: string, char: string, index: number): string => {
    return value.slice(0, index) + char + value.slice(index);
  }, []);

  const pairs = useMemo(() => {
    const entries: [string, [string, string]][] = [
      [ '(', [ '(', ')' ] ],
      [ ')', [ '(', ')' ] ],
      [ '[', [ '[', ']' ] ],
      [ ']', [ '[', ']' ] ],
      [ '{', [ '{', '}' ] ],
      [ '}', [ '{', '}' ] ],
      [ '<', [ '<', '>' ] ],
      [ '>', [ '<', '>' ] ],
      [ '\'', [ '\'', '\'' ] ],
      [ '"', [ '"', '"' ] ],
      [ '`', [ '`', '`' ] ]
    ];

    return new Map<string, [string, string]>(entries);
  }, []);

  return useCallback((code: string, enclosingTag: string, start: number, end: number): string => {
    const pair = pairs.get(enclosingTag);

    if (!pair) return code;
    const [ startTag, endTag ] = pair;

    return insertChar(insertChar(code, endTag, end), startTag, start);
  }, []);
};
