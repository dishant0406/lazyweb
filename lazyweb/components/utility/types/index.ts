export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  options: SelectOption[];
  selectedOptions: SelectOption[];
  setSelectedOptions: (selected: SelectOption[]) => void;
  placeholder?: string;
  onChange?: (selected: SelectOption[]) => void;
  showIcons?: boolean;
  isMultiSelect?: boolean;
  className?: string;
  optionsClassName?: string;
  noAddNew?: boolean;
  isLoading?: boolean;
  onOpen?: () => void;
  onRefresh?: () => void;
  type?: "number" | "text";
  onAddNew?: (option: SelectOption, onSuccess: () => void) => void;
  noCross?: boolean;
  noSearch?: boolean;
};
