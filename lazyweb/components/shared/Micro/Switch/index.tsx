import cn from "classnames";
import React from "react";

type SwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange = () => {},
  disabled = false,
  size = "md",
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange(!checked);
    }
  };

  const switchClasses = cn(
    "relative shadow-custom inline-flex items-center rounded-full transition-colors focus:outline-none",
    {
      "bg-switch": !checked,
      "bg-primary": checked,
      "opacity-50 cursor-not-allowed": disabled,
      "h-5 w-9": size === "sm",
      "h-6 w-11": size === "md",
      "h-7 w-14": size === "lg",
    }
  );

  const toggleClasses = cn(
    "absolute transform transition-transform rounded-full bg-background",
    {
      "translate-x-1": !checked,
      "translate-x-4": checked && size === "sm",
      "translate-x-5": checked && size === "md",
      "translate-x-7": checked && size === "lg",
      "h-4 w-4": size === "sm",
      "h-5 w-5": size === "md",
      "h-6 w-6": size === "lg",
    }
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={switchClasses}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={handleKeyDown}
    >
      <span className="sr-only">Toggle</span>
      <span className={toggleClasses} />
    </button>
  );
};

export default Switch;
