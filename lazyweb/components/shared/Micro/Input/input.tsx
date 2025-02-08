// @ts-nocheck

import cn from "classnames";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const inputProps =
      type === "number"
        ? {
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
              if ((e.target as HTMLInputElement).value === "0") {
                (e.target as HTMLInputElement).value = "";
              }
            },
            onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
              e.currentTarget.blur();
            },
            ...props,
          }
        : props;

    return (
      <input
        type={type}
        className={cn(
          "flex text-text-primary remove-number-arrows shadow-custom h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...inputProps}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

export type InputWithLabelProps = InputProps & {
  label?: string;
  subLabel?: string;
  contClassName?: string;
  errorMessage?: string;
  prefix?: string | React.ReactNode;
};

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      className,
      type,
      label,
      id,
      subLabel,
      contClassName,
      errorMessage,
      prefix,
      ...props
    },
    ref
  ) => {
    const prefixRef = React.useRef<HTMLDivElement>(null);
    const [prefixWidth, setPrefixWidth] = React.useState(0);

    React.useEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.offsetWidth);
      }
    }, [prefix]);

    return (
      <div className={cn("flex flex-col space-y-2", contClassName)}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div
              ref={prefixRef}
              className="absolute left-3 flex items-center pointer-events-none"
            >
              {typeof prefix === "string" ? (
                <span className="text-sm text-muted-foreground">{prefix}</span>
              ) : (
                prefix
              )}
            </div>
          )}
          <Input
            id={id}
            type={type}
            className={cn(
              className,
              errorMessage && "border-red-500",
              prefix && `pl-[${prefixWidth + 12}px]`
            )}
            style={
              prefix ? { paddingLeft: `${prefixWidth + 12}px` } : undefined
            }
            ref={ref}
            {...props}
          />
        </div>
        {errorMessage ? (
          <span className="text-sm text-red-500">{errorMessage}</span>
        ) : subLabel ? (
          <span className="text-sm text-muted-foreground">{subLabel}</span>
        ) : null}
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export { InputWithLabel };
