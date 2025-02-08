// @ts-nocheck

import cn from "classnames";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { type ReactElement, useState } from "react";

type IconPosition = "front" | "back";

type CollapsibleOption = {
  id: string;
  label: string;
  icon?: ReactElement;
  iconPosition?: IconPosition;
  href?: string;
  onClick?: () => void;
  subOptions?: CollapsibleOption[];
  isVisible?: boolean;
};

type CollapsibleProps = {
  options: CollapsibleOption[];
  defaultOpenIds?: string[];
  selectedIds?: string[];
  noBorder?: boolean;
};

const Collapsible: React.FC<CollapsibleProps> = ({
  options,
  defaultOpenIds = [],
  selectedIds = [],
  noBorder,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultOpenIds);

  const toggleExpand = (id: string, option: CollapsibleOption) => {
    setExpandedItems((prev) => {
      if (prev.includes(id)) {
        const newExpanded = prev.filter((item) => item !== id);
        option.subOptions?.forEach((subOption) => {
          if (isSelected(subOption) && !newExpanded.includes(subOption.id)) {
            newExpanded.push(subOption.id);
          }
        });
        return newExpanded;
      } else {
        return [...prev, id];
      }
    });
  };

  const isSelected = (option: CollapsibleOption): boolean => {
    return (
      selectedIds.includes(option.id) ||
      (option.subOptions?.some((subOption) => isSelected(subOption)) ?? false)
    );
  };

  const isAnySubOptionVisible = (subOptions?: CollapsibleOption[]): boolean => {
    if (!subOptions || subOptions.length === 0) return false;
    return subOptions.some(
      (option) =>
        option.isVisible !== false || isAnySubOptionVisible(option.subOptions)
    );
  };

  const renderOption = (option: CollapsibleOption, depth = 0) => {
    if (option.isVisible === false) {
      return null;
    }

    const hasSubOptions = option.subOptions && option.subOptions.length > 0;

    if (hasSubOptions && !isAnySubOptionVisible(option.subOptions)) {
      return null;
    }

    const isExpanded = expandedItems.includes(option.id);
    const isOptionSelected = isSelected(option);

    const handleClick = () => {
      if (hasSubOptions) {
        toggleExpand(option.id, option);
      }
      if (option.onClick) {
        option.onClick();
      }
    };

    const content = (
      <div
        className={cn(
          "flex items-center justify-between p-2 cursor-pointer transition-colors duration-200 ease-in-out",
          "text-foreground hover:bg-accent hover:text-header",
          {
            "text-accent-foreground": isExpanded || isOptionSelected,
            "text-header bg-accent": isOptionSelected,
          }
        )}
        onClick={handleClick}
        style={{
          paddingLeft: `${depth * 2 + 0.5}rem`,
          fontSize: `${1 - depth * 0.1}rem`,
        }}
      >
        <div className="flex items-center">
          {option.icon && option.iconPosition !== "back" && (
            <span className="mr-2">{option.icon}</span>
          )}
          <span>{option.label}</span>
        </div>
        <div className="flex items-center">
          {option.icon && option.iconPosition === "back" && (
            <span className="mr-2">{option.icon}</span>
          )}
          {hasSubOptions && (
            <ChevronRight
              className={cn("w-4 h-4 transition-transform duration-200", {
                "transform rotate-90": isExpanded,
              })}
            />
          )}
        </div>
      </div>
    );

    return (
      <div key={option.id} className="w-full">
        {option.href ? (
          <Link href={option.href} className="block w-full">
            {content}
          </Link>
        ) : (
          content
        )}
        {hasSubOptions && isExpanded && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-out",
              "animate-accordion-down"
            )}
          >
            {option.subOptions
              ?.filter(
                (subOption) =>
                  subOption.isVisible !== false ||
                  isAnySubOptionVisible(subOption.subOptions)
              )
              .map((subOption) => renderOption(subOption, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn("w-64 overflow-hidden bg-background", {
        "border border-border rounded-lg": !noBorder,
      })}
    >
      {options
        ?.filter(
          (option) =>
            option.isVisible !== false ||
            isAnySubOptionVisible(option.subOptions)
        )
        .map((option) => renderOption(option))}
    </div>
  );
};

export default Collapsible;
