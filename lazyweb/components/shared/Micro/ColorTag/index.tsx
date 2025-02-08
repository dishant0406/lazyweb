"use client";

import cn from "classnames";

type TagType = {
  name: string;
  color: string;
};

const ColorTag = ({ tag }: { tag: TagType }) => {
  const isColorDark = (hexColor: string) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luma < 128;
  };

  return (
    <div
      className="w-fit px-[0.5rem] whitespace-nowrap border py-[0.05rem] rounded-[8px] flex items-center justify-center"
      style={{ backgroundColor: tag.color }}
    >
      <p
        className={cn("text-xs", {
          "text-white": isColorDark(tag.color),
          "text-black": !isColorDark(tag.color),
        })}
      >
        {tag.name}
      </p>
    </div>
  );
};

export default ColorTag;
