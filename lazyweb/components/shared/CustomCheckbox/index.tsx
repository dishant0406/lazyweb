import { useManageSelectedCategories } from "@/hooks/Zustand";
import { SyntheticEvent, useEffect, useState } from "react";
import { Checkbox } from "react-input-checkbox";

type Props = {
  name: string;
  expanded: Boolean;
};

const CustomCheckbox = ({ name, expanded }: Props) => {
  const [checked, setChecked] = useState(false);
  const { selectedCategories, setSelectedCategories } =
    useManageSelectedCategories();

  const handleCheck = (e: SyntheticEvent<Element, Event>) => {
    setSelectedCategories(name.toLocaleLowerCase());
  };

  useEffect(() => {
    if (selectedCategories.includes(name.toLocaleLowerCase())) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [selectedCategories]);

  if (name.length > 5) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  } else {
    name = name.toUpperCase();
  }

  return (
    <button
      className={`${
        checked ? "text-white" : "text-[#747477]"
      } w-fit cursor-pointer transition-all ${
        expanded ? "h-[30px]" : "h-[0]"
      } `}
    >
      {expanded && (
        <Checkbox
          onChange={(e) => handleCheck(e)}
          value={checked}
          theme="bootstrap-checkbox"
        >
          {name}
        </Checkbox>
      )}
    </button>
  );
};

export default CustomCheckbox;
