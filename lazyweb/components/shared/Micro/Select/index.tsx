"use client";

import { SelectOption, SelectProps } from "@/components/utility/types";
import cn from "classnames";
import { Check, ChevronRight, Plus, RefreshCw, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-input"></div>
  </div>
);

const SelectHeader: React.FC<{
  selectedOptions: SelectOption[];
  placeholder: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClear: (e: React.MouseEvent<SVGSVGElement>) => void;
  isMultiSelect: boolean;
  handleRemove: (option: SelectOption) => void;
  onOpen: () => void;
  onRefresh?: () => void;
  noCross?: boolean;
}> = ({
  selectedOptions,
  placeholder,
  isOpen,
  setIsOpen,
  onRefresh,
  handleClear,
  isMultiSelect,
  handleRemove,
  onOpen,
  noCross,
}) => (
  <div
    className={cn(
      "flex  shadow-custom w-full items-center justify-between cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      {
        "rounded-b-none": isOpen,
      }
    )}
    onClick={() => {
      if (!isOpen) {
        onOpen();
      }

      setIsOpen(!isOpen);
    }}
  >
    <div className="flex w-full no-scroll-bar overflow-x-auto gap-1">
      {selectedOptions.length > 0 ? (
        selectedOptions.map((option) => (
          <span
            key={option.value}
            className={cn(
              "text-secondary-foreground dark:border-none border border-input whitespace-nowrap px-2 rounded-md text-sm flex items-center",
              {
                "bg-secondary": isMultiSelect,
              }
            )}
          >
            {option.label}
            {isMultiSelect && (
              <X
                className="ml-1 h-4 w-4 cursor-pointer"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleRemove(option);
                }}
              />
            )}
          </span>
        ))
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
    {onRefresh && (
      <RefreshCw
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onRefresh();
        }}
        className="w-4 h-4 ml-2 cursor-pointer hover:text-primary"
      />
    )}
    <div className="flex items-center">
      {selectedOptions.length > 0 && !noCross && (
        <X
          className="w-4 h-4 mr-1 cursor-pointer hover:text-destructive"
          onClick={handleClear}
        />
      )}
      <ChevronRight
        className={`w-4 h-4 text-text-primary transition-transform duration-200 ${
          isOpen ? "-rotate-90" : "rotate-90"
        }`}
      />
    </div>
  </div>
);

// SearchInput Component
const SearchInput: React.FC<{
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type: "number" | "text";
}> = ({ searchTerm, setSearchTerm, handleKeyDown, type }) => (
  <input
    max={20}
    maxLength={20}
    onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
      e.currentTarget.blur();
    }}
    type={type}
    className="w-full remove-number-arrows px-3 py-2 text-sm bg-transparent border-none focus:outline-none"
    placeholder="Search or add new..."
    value={searchTerm}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      setSearchTerm(e.target.value)
    }
    onKeyDown={handleKeyDown}
  />
);

// OptionItem Component
const OptionItem: React.FC<{
  option: SelectOption;
  isSelected: boolean;
  showIcons: boolean;
  isMultiSelect: boolean;
  handleSelect: (option: SelectOption) => void;
}> = ({ option, isSelected, showIcons, isMultiSelect, handleSelect }) => (
  <li
    className={cn(
      "p-2 flex items-center text-text-primary gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
      isSelected ? "bg-accent text-accent-foreground" : ""
    )}
    onClick={() => handleSelect(option)}
  >
    {showIcons && (
      <div className="h-8 w-8 bg-primary text-white text-xs flex items-center justify-center font-bold rounded-md">
        {option.label
          .split(/[\s-]+/)
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .slice(0, 3)}
      </div>
    )}
    {option.label}
    {isMultiSelect && isSelected && <Check className="ml-auto h-4 w-4" />}
  </li>
);

// AddNewOption Component
const AddNewOption: React.FC<{
  searchTerm: string;
  handleSelect: (option: SelectOption) => void;
}> = ({ searchTerm, handleSelect }) => (
  <li
    className="p-2 flex items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
    onClick={() => handleSelect({ value: searchTerm, label: searchTerm })}
  >
    <Plus className="h-4 w-4" />
    Add &quot;{searchTerm}&quot;
  </li>
);

// Main Select Component
const Select: React.FC<SelectProps> = ({
  options,
  selectedOptions = [],
  setSelectedOptions,
  placeholder = "Select option(s)",
  onChange = () => {},
  showIcons = false,
  isMultiSelect = false,
  className = "",
  optionsClassName = "",
  noAddNew,
  isLoading = false,
  onRefresh,
  onOpen = () => {},
  onAddNew = () => {},
  noCross,
  type = "text",
  noSearch,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] =
    useState<SelectOption[]>(options);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    portalRef.current = document.createElement("div");
    document.body.appendChild(portalRef.current);
    return () => {
      if (portalRef.current && document.body.contains(portalRef.current)) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      if (
        isOpen &&
        selectRef.current &&
        dropdownRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);
  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    if (isOpen && dropdownRef.current && selectRef.current) {
      const updateDropdownPosition = () => {
        const selectRect = selectRef.current?.getBoundingClientRect();
        const dropdownRect = dropdownRef.current?.getBoundingClientRect();

        if (selectRect && dropdownRect) {
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - selectRect.bottom;
          const spaceAbove = selectRect.top;
          const dropdownHeight = dropdownRect.height;

          if (!dropdownRef.current) return;

          if (spaceBelow >= dropdownHeight || spaceBelow > spaceAbove) {
            dropdownRef.current.style.top = `${selectRect.bottom}px`;
            dropdownRef.current.style.bottom = "auto";
            dropdownRef.current.style.maxHeight = `${Math.min(
              dropdownHeight,
              spaceBelow - 10
            )}px`;
          } else {
            dropdownRef.current.style.bottom = `${
              viewportHeight - selectRect.top
            }px`;
            dropdownRef.current.style.top = "auto";
            dropdownRef.current.style.maxHeight = `${Math.min(
              dropdownHeight,
              spaceAbove - 10
            )}px`;
          }

          dropdownRef.current.style.width = `${selectRect.width}px`;
          dropdownRef.current.style.left = `${selectRect.left}px`;
        }
      };

      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition);
      window.addEventListener("resize", updateDropdownPosition);

      return () => {
        window.removeEventListener("scroll", updateDropdownPosition);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }
  }, [isOpen]);

  const handleSelect = (option: SelectOption) => {
    if (isMultiSelect) {
      const updatedSelection = selectedOptions.some(
        (selected) => selected.value === option.value
      )
        ? selectedOptions.filter((selected) => selected.value !== option.value)
        : [...selectedOptions, option];

      setSelectedOptions(updatedSelection);
      onChange(updatedSelection);
      // Keep the dropdown open for multi-select
    } else {
      setSelectedOptions([option]);
      onChange([option]);
      setIsOpen(false); // Close the dropdown only for single-select
    }

    setSearchTerm("");
  };

  const handleRemove = (optionToRemove: SelectOption) => {
    const updatedSelection = selectedOptions.filter(
      (option) => option.value !== optionToRemove.value
    );

    setSelectedOptions(updatedSelection);
    onChange(updatedSelection);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const newOption: SelectOption = { value: searchTerm, label: searchTerm };

      const doesOptionExist = options.some(
        (option) => option.label.toLowerCase() === searchTerm.toLowerCase()
      );

      if (!doesOptionExist && onAddNew) {
        onAddNew(newOption, () => handleSelect(newOption));
      }
    }

    if (e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
    if ((e.target as HTMLInputElement).value === "0") {
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setSelectedOptions([]);
    setSearchTerm("");
    onChange([]);
  };

  return (
    <div className={cn("relative w-full", className)} ref={selectRef}>
      <SelectHeader
        onRefresh={onRefresh}
        selectedOptions={selectedOptions}
        placeholder={placeholder}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleClear={handleClear}
        isMultiSelect={isMultiSelect}
        handleRemove={handleRemove}
        onOpen={onOpen}
        noCross={noCross}
      />
      {isOpen &&
        portalRef.current &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={cn(
              "fixed dark hoist z-[1000] bg-popover border border-input rounded-b-md shadow-lg",
              optionsClassName
            )}
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {!noSearch && (
              <SearchInput
                type={type}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleKeyDown={handleKeyDown}
              />
            )}
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <ul>
                {filteredOptions.map((option) => (
                  <OptionItem
                    key={option.value}
                    option={option}
                    isSelected={selectedOptions.some(
                      (selected) => selected.value === option.value
                    )}
                    showIcons={showIcons}
                    isMultiSelect={isMultiSelect}
                    handleSelect={handleSelect}
                  />
                ))}
                {!noAddNew &&
                  searchTerm &&
                  !filteredOptions.some(
                    (option) =>
                      option.label.toLowerCase() === searchTerm.toLowerCase()
                  ) && (
                    <AddNewOption
                      searchTerm={searchTerm}
                      handleSelect={() => {
                        onAddNew?.(
                          { value: searchTerm, label: searchTerm },
                          () =>
                            handleSelect({
                              value: searchTerm,
                              label: searchTerm,
                            })
                        );
                      }}
                    />
                  )}
                {!filteredOptions.length && noAddNew && (
                  <li className="p-2 text-muted-foreground text-center">
                    No options found
                  </li>
                )}
              </ul>
            )}
          </div>,
          portalRef.current
        )}
    </div>
  );
};

export default Select;

type SelectWithLabelProps = {
  label: string;
  subLabel?: string;
  noCount?: boolean;
} & SelectProps;

export const SelectWithLabel = ({
  label,
  subLabel,
  ...selectProps
}: SelectWithLabelProps) => {
  const { selectedOptions, noCount } = selectProps;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-1 text-text-primary">
        {label}{" "}
        {selectedOptions.length > 0 &&
          !noCount &&
          `(${selectedOptions.length})`}
      </p>
      <Select {...selectProps} optionsClassName={"!max-h-40 overflow-y-auto"} />
      {subLabel && (
        <span className="text-sm text-muted-foreground">{subLabel}</span>
      )}
    </div>
  );
};
