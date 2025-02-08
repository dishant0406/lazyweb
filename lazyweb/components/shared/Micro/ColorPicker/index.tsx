import cn from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface ColorPickerProps {
  initialColor?: string;
  onChange?: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor = "#3b82f6",
  onChange,
  className,
}) => {
  const [color, setColor] = useState(initialColor);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColor(initialColor);
  }, [initialColor]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;

    setColor(newColor);
    onChange?.(newColor);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("relative w-fit", className)}>
      <div
        onClick={handleClick}
        className={cn(
          "w-10 h-10 rounded-md cursor-pointer",
          "hover:scale-110 border border-text-primary transition-transform duration-200 ease-in-out"
        )}
        style={{ backgroundColor: color }}
        role="button"
        aria-label="Open color picker"
      />
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={handleColorChange}
        className="sr-only"
        aria-label="Select color"
      />
    </div>
  );
};

export default ColorPicker;
