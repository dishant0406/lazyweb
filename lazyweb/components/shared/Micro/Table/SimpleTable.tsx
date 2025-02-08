// @ts-nocheck

import cn from "classnames";
import { CheckCircle, Copy } from "lucide-react";
import React, { type ReactNode, useState } from "react";

type WidthType = number | string;

type Header = {
  name: string;
  value: string;
  width: WidthType;
  canCopy?: boolean;
};

type TableProps = {
  headers: Header[];
  data: Record<string, ReactNode>[];
  columnBorder?: boolean;
};

const getWidthStyle = (width?: WidthType): string => {
  if (typeof width === "number") {
    return `${width}%`;
  }

  if (typeof width === "string") {
    return `${width}px`;
  }

  return "auto";
};

const CopyButton: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="mr-2 p-1 rounded-full hover:bg-secondary transition-colors duration-200"
    >
      {copied ? (
        <CheckCircle size={16} className="text-green-500" />
      ) : (
        <Copy size={16} />
      )}
    </button>
  );
};

const SimpleTable: React.FC<TableProps> = ({
  headers,
  data,
  columnBorder = false,
}) => {
  const getCellContent = (
    row: Record<string, ReactNode>,
    value: string
  ): string => {
    const content = row[value];

    if (content === null || content === undefined) {
      return "NA";
    }

    if (React.isValidElement(content)) {
      return "React Element";
    }

    return content.toString();
  };

  return (
    <div className="w-full h-full mt-4 overflow-x-auto">
      <div className="min-w-max  shadow-custom border border-input">
        <div
          className={cn("flex justify-between px-2 bg-secondary", {
            "divide-x divide-input": columnBorder,
          })}
        >
          {headers.map((header) => (
            <div
              key={header.value}
              className={cn("px-[1vw] py-[1vh]")}
              style={{ width: getWidthStyle(header.width) }}
            >
              <p className="text-text-primary text-lg font-bold">
                {header.name}
              </p>
            </div>
          ))}
        </div>
        {data.length === 0 ? (
          <div className="flex justify-center items-center h-[20vh]">
            <p className="text-text-primary text-lg">No data found</p>
          </div>
        ) : (
          data.map((row, index) => (
            <div
              key={index}
              className={cn(
                "flex px-2 items-center justify-between border-b border-input",
                {
                  "divide-x divide-input": columnBorder,
                }
              )}
            >
              {headers.map((header) => (
                <div
                  key={header.value}
                  className={cn("px-[1vw] py-[1vh] flex items-center")}
                  style={{ width: getWidthStyle(header.width) }}
                >
                  {React.isValidElement(row[header.value]) ? (
                    row[header.value]
                  ) : (
                    <>
                      {header.canCopy && (
                        <CopyButton
                          content={getCellContent(row, header.value)}
                        />
                      )}
                      <p className="text-text-primary whitespace-pre-wrap break-words flex-grow">
                        {getCellContent(row, header.value)}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimpleTable;
