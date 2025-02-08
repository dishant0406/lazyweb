// @ts-nocheck

import cn from "classnames";
import React, {
  type LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type TabContentProps = {
  tabs: string[];
  activeTab: string;
  children: React.ReactNode[];
  className?: string;
  contentClassName?: string;
};

const TabContent: React.FC<TabContentProps> = ({
  tabs,
  activeTab,
  children,
  className,
  contentClassName,
}) => {
  const [prevTab, setPrevTab] = useState(activeTab);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateHeight = useCallback(() => {
    if (containerRef.current) {
      const activeIndex = tabs.indexOf(activeTab);
      const activeContent = contentRefs.current[activeIndex];

      if (activeContent) {
        containerRef.current.style.height = `${activeContent.scrollHeight}px`;
      }
    }
  }, [activeTab, tabs]);

  useEffect(() => {
    if (activeTab !== prevTab) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setPrevTab(activeTab);
        setIsAnimating(false);
      }, 300); // Match this with the CSS transition duration

      return () => clearTimeout(timeout);
    }
  }, [activeTab, prevTab]);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [activeTab, tabs, updateHeight]);

  // Create a MutationObserver to watch for changes in the active content
  useEffect(() => {
    const activeIndex = tabs.indexOf(activeTab);
    const activeContent = contentRefs.current[activeIndex];

    if (activeContent) {
      const observer = new MutationObserver(updateHeight);

      observer.observe(activeContent, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [activeTab, tabs, updateHeight]);

  const getTransformStyle = (tab: string) => {
    const currentIndex = tabs.indexOf(activeTab);
    const tabIndex = tabs.indexOf(tab);
    const prevIndex = tabs.indexOf(prevTab);

    if (!isAnimating) {
      return { transform: `translateX(${(tabIndex - currentIndex) * 100}%)` };
    }

    const direction = currentIndex > prevIndex ? -1 : 1;
    const distance = Math.abs(currentIndex - prevIndex);
    const offset = (tabIndex - prevIndex) * 100 + direction * distance * 100;

    return { transform: `translateX(${offset}%)` };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative transition-[height] duration-300 ease-in-out",
        className
      )}
    >
      {tabs.map((tab, index) => (
        <div
          key={tab}
          ref={
            ((el: any) =>
              (contentRefs.current[index] =
                el)) as unknown as LegacyRef<HTMLDivElement>
          }
          className={cn(
            "absolute top-0 overflow-visible left-0 w-full transition-transform duration-300 ease-in-out",
            contentClassName,
            {
              "pointer-events-none": tab !== activeTab,
            }
          )}
          style={{
            ...getTransformStyle(tab),
            visibility: tab === activeTab || isAnimating ? "visible" : "hidden",
          }}
          aria-hidden={tab !== activeTab}
        >
          {children[index]}
        </div>
      ))}
    </div>
  );
};

export default TabContent;
