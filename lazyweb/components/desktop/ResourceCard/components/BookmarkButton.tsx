import { useState } from "react";
import { BsBookmarksFill } from "react-icons/bs";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onClick: () => void;
}

const BookmarkButton = ({ isBookmarked, onClick }: BookmarkButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-8 w-8 absolute flex items-center justify-center top-2.5 right-2.5 rounded-full transition-transform duration-300 hover:scale-110"
      style={{ backgroundColor: "rgba(32, 33, 36, 0.5)" }}
    >
      <BsBookmarksFill
        className={`text-lg transition-colors duration-300 ${
          isHovered || isBookmarked ? "text-[#92ec01]" : "text-white"
        }`}
      />
    </button>
  );
};

export default BookmarkButton;
