// @ts-nocheck

import cn from "classnames";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type PopoverProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "right" | "bottom" | "left";
  className?: string;
  contentClassName?: string;
  onStateChange?: (isOpen: boolean) => void;
};

export type PopoverRef = {
  close: () => void;
};

const Popover = forwardRef<PopoverRef, PopoverProps>(
  (
    {
      trigger,
      content,
      position = "bottom",
      className,
      contentClassName,
      onStateChange,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      close: () => setIsOpen(false),
    }));

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const togglePopover = () => {
      setIsOpen(!isOpen);
      onStateChange?.(!isOpen);
    };

    const positionClasses = {
      top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
      bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    };

    return (
      <div className={cn("relative inline-block", className)} ref={popoverRef}>
        <div onClick={togglePopover} className="cursor-pointer">
          {trigger}
        </div>
        {isOpen && (
          <div
            className={cn(
              "absolute z-10 w-64 p-4 bg-popover text-popover-foreground rounded-md shadow-lg",
              "border border-border",
              positionClasses[position],
              contentClassName
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Popover.displayName = "Popover";

export default Popover;
