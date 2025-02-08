// @ts-nocheck

import cn from "classnames";
import { ChevronRight, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

type DropdownOption = {
  value: string;
  label: React.ReactElement | string;
  className?: string;
};

type DropdownProps = {
  options: DropdownOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
  selected?: DropdownOption;
  showSearch?: boolean;
  openAbove?: boolean;
};

const DropDown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className,
  buttonClassName,
  optionsClassName,
  optionClassName,
  selected,
  showSearch = false,
  openAbove: openAboveProp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    selected || null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [openAbove, setOpenAbove] = useState(openAboveProp || false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDarkTheme = true;

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 300; // Estimated height of dropdown

      const shouldOpenAbove =
        openAboveProp !== undefined
          ? openAboveProp
          : spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

      setOpenAbove(shouldOpenAbove);
      setDropdownPosition({
        top: shouldOpenAbove ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        maxHeight: shouldOpenAbove
          ? rect.top - 10
          : windowHeight - rect.bottom - 10,
      });
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (
    event: React.MouseEvent,
    option: DropdownOption
  ) => {
    event.stopPropagation();
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = options.filter((option) =>
      option.label.toString().toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setFilteredOptions(options);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
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
  }, [isOpen, options]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  useEffect(() => {
    if (openAboveProp !== undefined) {
      setOpenAbove(openAboveProp);
    }
  }, [openAboveProp]);

  useEffect(() => {
    if (selected) {
      setSelectedOption(selected);
    }
  }, [selected]);

  return (
    <div ref={ref} className={cn("relative inline-block text-left", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "inline-flex shadow-custom justify-between items-center w-full px-4 py-2 text-sm font-medium",
          "bg-background text-foreground",
          "border border-input rounded-md",
          "hover:bg-accent hover:text-accent-foreground",
          buttonClassName
        )}
      >
        {selectedOption && selectedOption.label
          ? selectedOption.label
          : placeholder}
        <ChevronRight
          className={cn("ml-2 h-4 w-4 transition-all duration-200", {
            "transform -rotate-90": isOpen && !openAbove,
            "transform rotate-90": !isOpen || openAbove,
          })}
        />
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={cn(
              "fixed overflow-hidden rounded-md shadow-lg",
              "bg-popover border border-border",
              "z-50",
              {
                dark: isDarkTheme,
                light: !isDarkTheme,
              },
              optionsClassName
            )}
            style={{
              top: openAbove ? "auto" : `${dropdownPosition.top}px`,
              bottom: openAbove
                ? `${window.innerHeight - dropdownPosition.top}px`
                : "auto",
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight: `${dropdownPosition.maxHeight}px`,
            }}
          >
            {showSearch && (
              <div className="px-2 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className={cn(
                      "w-full pl-10 pr-4 py-2 text-sm",
                      "bg-background text-foreground",
                      "border border-input rounded-md",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    )}
                  />
                </div>
              </div>
            )}
            <div className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={(event) => handleOptionClick(event, option)}
                  className={cn(
                    "block w-full text-left px-4 py-2 text-sm",
                    "text-popover-foreground",
                    "hover:bg-accent hover:text-accent-foreground",
                    {
                      "bg-accent text-accent-foreground":
                        selectedOption?.value === option.value,
                    },
                    "focus:outline-none focus:bg-accent focus:text-accent-foreground",
                    optionClassName,
                    option.className
                  )}
                  role="menuitem"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DropDown;
