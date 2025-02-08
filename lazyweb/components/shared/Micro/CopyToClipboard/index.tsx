import cn from "classnames";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "..";

const CopyToClipboard = ({ value, tooltip }: Props) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      setCopied(true);
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant="outline"
      tooltip={tooltip}
      size="icon"
      className="disabled:opacity-100"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      disabled={copied}
    >
      <div
        className={cn(
          "transition-all",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check
          className="stroke-emerald-500"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
      <div
        className={cn(
          "absolute transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Copy size={16} strokeWidth={2} aria-hidden="true" />
      </div>
    </Button>
  );
};

export default CopyToClipboard;

type Props = {
  value: string;
  tooltip?: string;
};
