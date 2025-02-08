import { useCallback, useState } from 'react';

export default (
  code: string | undefined,
  onChange: (code: string) => void
): [string, (code: string) => void] => {
  const codeIsUndefined = code === undefined;
  const initialCode = codeIsUndefined ? '' : code;
  const [ state, setState ] = useState<string>(initialCode);

  const setCodeState = useCallback(
    (code: string) => {
      if (codeIsUndefined) setState(code);
      onChange(code);
    },
    [ codeIsUndefined ]
  );

  if (!codeIsUndefined && code !== state) setState(code);

  return [ state, setCodeState ];
};
