import cn from "classnames";
import { useRef, useState } from "react";

import Popover, { type PopoverRef } from "../Popover";

import { Button } from "../Button";
import { Input } from "../Input/input";

type Props = {
  textClassName?: string;
  inputClassName?: string;
  onSave?: (value: string) => void;
  defaultValue?: string;
};

const EditInput = ({
  onSave = () => {},
  defaultValue = "",
  ...props
}: Props) => {
  const [value, setValue] = useState(defaultValue);
  const popoverRef = useRef<PopoverRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    onSave(value);
    popoverRef.current?.close();
  };

  const onStateChange = (isOpen: boolean) => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <Popover
      ref={popoverRef}
      onStateChange={onStateChange}
      trigger={
        <span className="flex items-center gap-2">
          <p className={cn("text-text-primary", props.textClassName)}>
            {defaultValue}
          </p>
        </span>
      }
      content={
        <div className="flex bg-background gap-2">
          <Input
            ref={inputRef}
            className={cn(
              "text-text-primary bg-background w-40",
              props.inputClassName
            )}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
          <Button
            className="text-text-primary"
            onClick={(e) => handleSubmit(e as any)}
          >
            Save
          </Button>
        </div>
      }
    />
  );
};

export default EditInput;
