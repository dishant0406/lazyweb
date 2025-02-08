// @ts-nocheck

import cn from "classnames";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";

type AccordionItemProps = {
  title: string | React.ReactNode | React.ReactElement;
  content: React.ReactNode | React.ReactElement;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  noArrow?: boolean;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  isOpen = false,
  onClick,
  className = "",
  titleClassName = "",
  contentClassName = "",
  iconClassName = "",
  noArrow = false,
}) => {
  return (
    <div
      className={cn(
        "border  shadow-custom rounded-md border-border",
        className
      )}
    >
      <button
        className={cn(
          "flex w-full items-center justify-between py-4 px-6 text-left transition-colors hover:bg-muted/50",
          titleClassName
        )}
        onClick={onClick}
      >
        {title}
        {!noArrow && (
          <ChevronRight
            className={cn(
              "h-5 w-5 transform transition-transform duration-200",
              { "rotate-90": isOpen },
              iconClassName
            )}
          />
        )}
      </button>
      <div
        className={cn(
          "overflow-y-auto transition-all duration-200",
          isOpen ? "max-h-96" : "max-h-0",
          contentClassName
        )}
      >
        <div className="p-6">{content}</div>
      </div>
    </div>
  );
};

type AccordionProps = {
  items: {
    title: string | React.ReactNode | React.ReactElement;
    content: React.ReactNode | React.ReactElement;
  }[];
  className?: string;
  itemClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  className = "",
  itemClassName = "",
  titleClassName = "",
  contentClassName = "",
  iconClassName = "",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("rounded-lg text-foreground", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
          className={itemClassName}
          titleClassName={titleClassName}
          contentClassName={contentClassName}
          iconClassName={iconClassName}
        />
      ))}
    </div>
  );
};

export default Accordion;
