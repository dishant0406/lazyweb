// @ts-nocheck

import cn from "classnames";
import React from "react";

import { successToast } from "@/components/utility/toast";
import Tooltip from "../Tooltip";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "success-outline"
    | "destructive-outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  canCopy?: boolean;
  tooltip?: string | React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  canCopy = false,
  tooltip,
}) => {
  const badgeClasses = cn(
    className,
    "items-center select-none rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      "bg-primary text-white hover:bg-primary/80": variant === "default",
      "bg-secondary text-secondary-foreground hover:bg-secondary/80":
        variant === "secondary",
      "bg-destructive text-destructive-foreground": variant === "destructive",
      "border border-input hover:bg-accent hover:text-accent-foreground":
        variant === "outline",
      "border-success border text-text-primary ": variant === "success-outline",
      "border-destructive border text-text-primary ":
        variant === "destructive-outline",

      "bg-background text-text-primary hover:bg-accent hover:text-accent-foreground":
        variant === "ghost",
      "px-2.5 py-0.5 text-xs": size === "sm",
      "px-3 py-1 text-xs md:text-sm": size === "md",
      "px-4 py-1.5 text-sm md:text-base": size === "lg",
    }
  );

  const extractTextFromChildren = (children: React.ReactNode): string => {
    if (typeof children === "string") {
      return children;
    }

    if (Array.isArray(children)) {
      return children.map(extractTextFromChildren).join("");
    }

    return "";
  };

  const handleCopy = () => {
    if (canCopy) {
      navigator.clipboard.writeText(extractTextFromChildren(children));
      successToast("Copied to clipboard");
    }
  };

  return (
    <Tooltip content={tooltip}>
      <span onClick={handleCopy} className={badgeClasses}>
        {children}
      </span>
    </Tooltip>
  );
};

export default Badge;
