// @ts-nocheck

import React, { forwardRef } from "react";

import Tooltip from "../Tooltip";

type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "success";

type Size = "default" | "sm" | "lg" | "icon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  tooltip?: React.ReactNode;
  tooltipPosition?: "top" | "right" | "bottom" | "left";
};

const shadowClass = "shadow-custom";

const shadowStyle: Record<Variant, string> = {
  default: shadowClass,
  destructive: shadowClass,
  outline: shadowClass,
  secondary: shadowClass,
  ghost: "",
  link: "",
  success: shadowClass,
};

const variantStyles: Record<Variant, string> = {
  default: "bg-primary text-black",
  destructive: "bg-destructive text-background ",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "hover:bg-accent text-text-primary hover:text-accent-foreground",
  link: "text-text-primary underline-offset-4 hover:underline",
  success: "bg-success text-success-foreground",
};

const sizeStyles: Record<Size, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-7 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

const baseStyles = `
  inline-flex items-center   justify-center whitespace-nowrap rounded-md text-sm font-medium
  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative disabled:cursor-not-allowed
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      children,
      tooltip,
      tooltipPosition,
      ...props
    },
    ref
  ) => {
    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${shadowStyle[variant]}

      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    const buttonElement = (
      <button className={combinedClassName} ref={ref} {...props}>
        {children}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
