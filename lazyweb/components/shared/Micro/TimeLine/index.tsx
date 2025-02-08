// @ts-nocheck

import { type ReactNode } from "react";

import { Button } from "../Button";

const Stepper = ({
  step,
  title,
  children,
  titleTooltip,
}: {
  step?: number;
  title: string | ReactNode;
  children?: ReactNode;
  titleTooltip?: string;
}) => {
  return (
    <div className="flex gap-6 mt-2">
      <div className="flex flex-col mt-1 items-center">
        <div className="flex size-8 flex-none select-none items-center justify-center rounded-full border border-neutral-400/20 bg-neutral-100 font-medium text-neutral-700 text-sm dark:border-neutral-400/10 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80">
          {step ? (
            step
          ) : (
            <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-400" />
          )}
        </div>
        <div className="relative my-1 flex-1 w-px rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="flex flex-col w-full">
        <Button
          tooltip={titleTooltip}
          variant="link"
          className="mb-4 !w-fit font-medium cursor-default text-lg text-neutral-700 tracking-tight dark:text-neutral-50"
        >
          {title}
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Stepper;
