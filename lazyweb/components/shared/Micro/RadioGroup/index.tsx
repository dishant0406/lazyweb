// @ts-nocheck

import cn from "classnames";
import React, { createContext, useContext } from "react";

// Radio Component
type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: string;
  className?: string;
  labelClassName?: string;
};

const Radio: React.FC<RadioProps> = ({
  label,
  className,
  labelClassName,
  ...props
}) => {
  const { value: groupValue, onChange } = useContext(RadioGroupContext);

  return (
    <label
      className={cn("flex items-center space-x-2 cursor-pointer", className)}
    >
      <input
        type="radio"
        className="sr-only"
        checked={props.value === groupValue}
        onChange={() => onChange(props.value)}
        {...props}
      />
      <span
        className={cn(
          "w-4 h-4 border rounded-full flex items-center justify-center",
          "border-input",
          props.value === groupValue ? "bg-primary" : "bg-background",
          "transition-colors duration-200 ease-in-out"
        )}
      >
        {props.value === groupValue && (
          <span className="w-2 h-2 rounded-full bg-primary-foreground" />
        )}
      </span>
      <span
        className={cn("text-sm font-medium text-foreground", labelClassName)}
      >
        {label}
      </span>
    </label>
  );
};

// RadioGroup Component
type RadioGroupContextType = {
  value: string;
  onChange: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextType>({
  value: "",
  onChange: () => {},
});

type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  labelClassName?: string;
  radioClassName?: string;
  radioLabelClassName?: string;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  className,
  label,
  labelClassName,
  radioClassName,
  radioLabelClassName,
}) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange }}>
      <fieldset className={cn("space-y-2", className)}>
        {label && (
          <legend
            className={cn(
              "text-sm font-medium text-foreground mb-2",
              labelClassName
            )}
          >
            {label}
          </legend>
        )}
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            className={radioClassName}
            labelClassName={radioLabelClassName}
          />
        ))}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};

export { RadioGroup };
