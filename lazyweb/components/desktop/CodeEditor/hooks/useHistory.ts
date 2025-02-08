import { useCallback, useRef } from 'react';


type History = {
  code: string;
  start: number;
  end: number;
};

export default (
  initialCode: string
): [
    (code: string, start: number, end: number) => void,
    () => History | undefined,
    () => History | undefined
  ] => {
  const historyRef = useRef<History[]>([
    { code: initialCode, start: initialCode.length, end: initialCode.length }
  ]);
  const historyPointerRef = useRef<number>(historyRef.current.length - 1);

  const push = useCallback((code: string, start: number, end: number) => {
    const history = { code, start, end };

    historyRef.current[++historyPointerRef.current] = history;
  }, []);

  const undo = useCallback((): History | undefined => {
    const history = historyRef.current[--historyPointerRef.current];

    if (!history) historyPointerRef.current = 0;
    return history;
  }, []);

  const redo = useCallback((): History | undefined => {
    const history = historyRef.current[++historyPointerRef.current];

    if (!history) historyPointerRef.current--;
    return history;
  }, []);

  return [ push, undo, redo ];
};
