// @ts-nocheck

import { type ReactNode } from "react";

import { Button } from "../Button";

const SectionHeader = ({
  title,
  description,
  buttonText,
  onButtonClick,
  rightComponents,
  buttonConfig,
}: Props) => {
  return (
    <header className="w-full flex md:flex-row md:p-0 p-2 flex-col md:gap-0 gap-2 justify-between mb-4 md:items-center">
      <div className="flex flex-col">
        <h2 className="text-2xl  text-header font-bold">{title}</h2>
        <p className="text-text-primary/80 text-sm">{description}</p>
      </div>
      <div className="flex items-center md:w-fit w-full gap-4">
        {buttonText && (
          <Button
            disabled={buttonConfig?.isDisabled}
            tooltip={buttonConfig?.tooltip}
            onClick={onButtonClick}
            className="md:!w-fit !w-full"
          >
            {buttonText}
          </Button>
        )}
        {rightComponents}
      </div>
    </header>
  );
};

type Props = {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  rightComponents?: ReactNode;
  buttonConfig?: {
    isDisabled: boolean;
    tooltip: string;
  };
};

export default SectionHeader;
