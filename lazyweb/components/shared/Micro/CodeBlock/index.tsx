import cn from "classnames";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

interface CodeSnippetProps {
  code: string;
  className?: string;
  prefix?: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  prefix,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={cn(
        "relative bg-black text-white rounded-lg overflow-hidden",
        "font-mono text-sm text-gray-200",
        className
      )}
    >
      <div className="group flex items-center relative">
        {prefix && (
          <div className="bg-black text-white pl-2 mr-[-4px]">{prefix}</div>
        )}
        <pre className="p-4 pr-12 overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeSnippet;
