// @ts-nocheck

import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

type Position = "top" | "right" | "bottom" | "left";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: Position;
  className?: string;
  tooltipClassName?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position,
  className,
  tooltipClassName,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState<Position | null>(
    position || null
  );
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isDarkTheme = true;

  const positionClasses: Record<Position, string> = {
    top: "translate-y-[-100%] translate-x-[-50%] mb-2",
    right: "translate-x-[0%] translate-y-[-50%] ml-2",
    bottom: "translate-y-[0%] translate-x-[-50%] mt-2",
    left: "translate-x-[-100%] translate-y-[-50%] mr-2",
  };

  const arrowClasses: Record<Position, string> = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-b border-l",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-t border-l",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-t border-r",
  };

  const calculatePosition = () => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;

    if (!trigger || !tooltip) return;

    const triggerRect = trigger.getBoundingClientRect();

    tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceTop = triggerRect.top;
    const spaceRight = viewportWidth - triggerRect.right;
    const spaceBottom = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;

    const spaces = [
      { position: "top" as Position, space: spaceTop },
      { position: "right" as Position, space: spaceRight },
      { position: "bottom" as Position, space: spaceBottom },
      { position: "left" as Position, space: spaceLeft },
    ];

    const bestPosition =
      position ||
      spaces.reduce((prev, current) =>
        current.space > prev.space ? current : prev
      ).position;

    setCalculatedPosition(bestPosition);

    // Set tooltip position
    switch (bestPosition) {
      case "top":
        tooltip.style.left = `${triggerRect.left + triggerRect.width / 2}px`;
        tooltip.style.top = `${triggerRect.top}px`;
        break;

      case "right":
        tooltip.style.left = `${triggerRect.right}px`;
        tooltip.style.top = `${triggerRect.top + triggerRect.height / 2}px`;
        break;

      case "bottom":
        tooltip.style.left = `${triggerRect.left + triggerRect.width / 2}px`;
        tooltip.style.top = `${triggerRect.bottom}px`;
        break;

      case "left":
        tooltip.style.left = `${triggerRect.left - 10}px`;
        tooltip.style.top = `${triggerRect.top + triggerRect.height / 2}px`;
        break;
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition);
      return () => {
        window.removeEventListener("resize", calculatePosition);
        window.removeEventListener("scroll", calculatePosition);
      };
    }
  }, [isVisible]);

  const renderTooltip = () => {
    if (!isVisible) return null;

    return ReactDOM.createPortal(
      <>
        {content && (
          <div
            ref={tooltipRef}
            className={cn(
              {
                dark: isDarkTheme,
                light: !isDarkTheme,
              },
              "fixed z-50 px-3 py-2 text-sm font-medium",
              "bg-popover text-popover-foreground",
              "border border-border rounded-md shadow-md",
              "transition-opacity duration-300",
              "max-w-xs w-max",
              calculatedPosition
                ? positionClasses[calculatedPosition]
                : "opacity-0",
              tooltipClassName
            )}
          >
            {content}
            {calculatedPosition && (
              <div
                className={cn(
                  "absolute h-2 w-2 transform rotate-45 pointer-events-none",
                  "bg-popover",
                  arrowClasses[calculatedPosition]
                )}
              />
            )}
          </div>
        )}
      </>,
      document.body
    );
  };

  return (
    <div className={cn("relative inline-block", className)} ref={triggerRef}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="flex flex-col justify-center"
      >
        {children}
      </div>
      {renderTooltip()}
    </div>
  );
};

export default Tooltip;
