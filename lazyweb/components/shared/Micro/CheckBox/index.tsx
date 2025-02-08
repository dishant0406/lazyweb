//@ts-nocheck

import React from "react";

type Props = {
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: boolean;
};

const Checkbox = ({ children, onChange, value }: Props) => {
  return (
    <label className="flex items-center gap-1 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        className="w-[0.9rem] h-[0.9rem] text-blue-600 bg-gray-100 border-gray-300 rounded-sm  dark:ring-offset-gray-800 focus:ring-0 dark:bg-gray-700 dark:border-gray-600"
      />
      <span>{children}</span>
    </label>
  );
};

export default Checkbox;
