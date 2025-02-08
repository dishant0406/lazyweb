import cn from "classnames";
import React, { useEffect, useState } from "react";

type PercentageSliderProps = {
  initialValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  thumbClassName?: string;
  trackClassName?: string;
  labelClassName?: string;
  min?: number;
  max?: number;
  step?: number;
  showActualValue?: boolean;
  disabled?: boolean;
};

const PercentageSlider: React.FC<PercentageSliderProps> = ({
  initialValue = 50,
  onChange,
  className,
  thumbClassName,
  trackClassName,
  labelClassName,
  min = 0,
  max = 100,
  step = 1,
  showActualValue = false,
  disabled,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, min, max, step]);

  const calculatePercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const calculateActualValue = (percentage: number) => {
    const rawValue = (percentage / 100) * (max - min) + min;
    return Number(rawValue.toFixed(getDecimalPlaces(step)));
  };

  const getDecimalPlaces = (num: number) => {
    if (Math.floor(num) === num) return 0;
    return num.toString().split(".")[1].length || 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseFloat(event.target.value);
    const newValue = calculateActualValue(newPercentage);
    setValue(newValue);
    onChange?.(newValue);
  };

  const displayValue = showActualValue ? value : calculatePercentage(value);

  const stepsCount = (max - min) / step;
  const percentageStep = 100 / stepsCount;

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <input
        type="range"
        min="0"
        max="100"
        disabled={disabled}
        step={percentageStep}
        value={calculatePercentage(value)}
        onChange={handleChange}
        className={cn(
          "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer",
          "dark:bg-secondary",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
          "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all",
          "[&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary",
          "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-all",
          "[&::-moz-range-thumb]:hover:scale-110",
          trackClassName,
          {
            "[&::-webkit-slider-thumb]:bg-primary": !thumbClassName,
            "[&::-moz-range-thumb]:bg-primary": !thumbClassName,
          }
        )}
        style={
          {
            "--thumb-color": thumbClassName
              ? `var(--${thumbClassName.split("-")[1]})`
              : "var(--primary)",
          } as React.CSSProperties
        }
      />
      <div className="flex justify-between">
        <span className={cn("text-sm text-muted-foreground", labelClassName)}>
          {min}
        </span>
        <span
          className={cn("text-sm font-medium text-foreground", labelClassName)}
        >
          {showActualValue
            ? value.toFixed(getDecimalPlaces(step))
            : `${displayValue.toFixed(getDecimalPlaces(step))}%`}
        </span>
        <span className={cn("text-sm text-muted-foreground", labelClassName)}>
          {max}
        </span>
      </div>
    </div>
  );
};

export default PercentageSlider;
