// @ts-nocheck

import cn from "classnames";
import React, { type LegacyRef, useEffect, useRef, useState } from "react";

type TabProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
  reverse?: boolean;
  elements?: React.ReactNode[];
  secondaryValues?: string[];
};

const Tabs: React.FC<TabProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  className = "",
  reverse = false,
  secondaryValues,
  elements,
}) => {
  const [sliderStyle, setSliderStyle] = useState({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const containerClasses = cn(
    className,
    " shadow-custom",
    "flex space-x-1 rounded-lg p-1 relative",
    reverse ? "bg-background" : "bg-secondary"
  );

  const getButtonClasses = (tab: string) =>
    cn(
      "px-4 py-2 text-sm flex items-center justtify-center font-medium transition-all duration-200 ease-in-out rounded-md relative z-[2]",
      activeTab === tab
        ? reverse
          ? "text-secondary-foreground"
          : "text-foreground"
        : reverse
        ? "text-muted-foreground hover:text-secondary-foreground"
        : "text-muted-foreground hover:text-accent-foreground"
    );

  useEffect(() => {
    const activeTabElement = tabRefs.current[tabs.indexOf(activeTab)];

    if (activeTabElement) {
      setSliderStyle({
        left: `${activeTabElement.offsetLeft}px`,
        width: `${activeTabElement.offsetWidth}px`,
        height: `${activeTabElement.offsetHeight}px`,
        top: `${activeTabElement.offsetTop}px`,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className={containerClasses}>
      <div
        className={cn(
          "absolute transition-all duration-200 ease-in-out rounded-md",
          reverse ? "bg-secondary" : "bg-background",
          "shadow-sm"
        )}
        style={sliderStyle}
      />
      {tabs.map((tab, index) => (
        <button
          key={tab}
          ref={
            ((el: any) =>
              (tabRefs.current[index] =
                el)) as unknown as LegacyRef<HTMLButtonElement>
          }
          onClick={() => setActiveTab(tab)}
          className={getButtonClasses(tab)}
        >
          {elements && elements[index] && elements[index]}
          {tab}
          {secondaryValues && secondaryValues[index] && (
            <span className="rounded-md  shadow-custom font-bold p-1 px-2 text-black bg-white ml-2">
              {secondaryValues[index]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
