// @ts-nocheck

import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import Tooltip from "../Tooltip";

type MenuItem = {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  subMenu?: MenuItem[];
  subMenuClassName?: string;
  disabled?: string | boolean;
};

type ContextMenuProps = {
  trigger: React.ReactNode;
  items: MenuItem[];
  className?: string;
  menuClassName?: string;
};

const MenuItemComponent: React.FC<{ item: MenuItem; depth?: number }> = ({
  item,
  depth = 0,
}) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [subMenuPosition, setSubMenuPosition] = useState<"left" | "right">(
    "right"
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsSubMenuOpen(true);
    updateSubMenuPosition();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSubMenuOpen(false);
    }, 100);
  };

  const updateSubMenuPosition = () => {
    if (itemRef.current && subMenuRef.current) {
      const itemRect = itemRef.current.getBoundingClientRect();
      const subMenuRect = subMenuRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      if (
        itemRect.right + subMenuRect.width > windowWidth &&
        itemRect.left > subMenuRect.width
      ) {
        setSubMenuPosition("left");
      } else {
        setSubMenuPosition("right");
      }
    }
  };

  useEffect(() => {
    if (isSubMenuOpen) {
      updateSubMenuPosition();
    }
  }, [isSubMenuOpen]);

  const menuItem = (
    <div
      ref={itemRef}
      className={cn(
        "relative px-2 py-1 rounded-sm text-sm",
        {
          "cursor-pointer hover:bg-accent hover:text-accent-foreground":
            !item.disabled,
          "cursor-not-allowed opacity-50": item.disabled,
        },
        { "pl-4": depth > 0 }
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        if (!item.subMenu && !item.disabled) {
          item.onClick?.();
        }
      }}
    >
      <div className="flex w-full justify-between items-center space-x-2">
        <div className="flex gap-2 items-center">
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        {item.subMenu && (
          <svg
            className="w-4 h-4 ml-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </div>
      {item.subMenu && isSubMenuOpen && (
        <div
          ref={subMenuRef}
          className={cn(
            "absolute top-0 min-w-32 bg-popover text-popover-foreground shadow-md rounded-md overflow-visible",
            subMenuPosition === "left" ? "right-full" : "left-full",
            item?.subMenuClassName || ""
          )}
          style={{
            zIndex: 1000,
            marginTop: "-0.25rem",
            marginLeft: subMenuPosition === "right" ? "0.25rem" : undefined,
            marginRight: subMenuPosition === "left" ? "0.25rem" : undefined,
          }}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          {item.subMenu.map((subItem, index) => (
            <MenuItemComponent key={index} item={subItem} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {item.disabled ? (
        <Tooltip content={item.disabled}>{menuItem}</Tooltip>
      ) : (
        menuItem
      )}
    </div>
  );
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  trigger,
  items,
  className,
  menuClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [direction, setDirection] = useState<"left" | "right">("right");
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const isDarkTheme = true;

  const updateMenuPosition = () => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    let newLeft = triggerRect.left;
    let newTop = triggerRect.bottom;
    let newDirection: "left" | "right" = "right";

    if (triggerRect.left + menuRect.width > windowWidth) {
      newLeft = triggerRect.right - menuRect.width;
      newDirection = "left";
    }

    // Adjust top position if menu goes below viewport
    if (newTop + menuRect.height > window.innerHeight) {
      newTop = triggerRect.top - menuRect.height;
    }

    setPosition({ top: newTop, left: newLeft });
    setDirection(newDirection);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateMenuPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateMenuPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      updateMenuPosition();
    }
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block", className)}>
      <div ref={triggerRef} className="cursor-pointer" onClick={handleClick}>
        {trigger}
      </div>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            className={cn(
              "fixed z-50 min-w-32 bg-popover text-popover-foreground shadow-md rounded-md overflow-visible",
              direction === "left" ? "origin-top-right" : "origin-top-left",
              menuClassName || "",
              {
                dark: isDarkTheme,
                light: !isDarkTheme,
              }
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {items.map((item, index) => (
              <MenuItemComponent key={index} item={item} />
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default ContextMenu;
