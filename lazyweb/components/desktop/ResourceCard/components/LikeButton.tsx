import { FcLike, FcLikePlaceholder } from "react-icons/fc";

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
}

const LikeButton = ({ isLiked, onClick }: LikeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 flex items-center justify-center absolute top-2.5 left-2.5 rounded-full transition-transform duration-300 hover:scale-110"
      style={{ backgroundColor: "rgba(32, 33, 36, 0.5)" }}
    >
      {isLiked ? (
        <FcLike className="text-lg" />
      ) : (
        <FcLikePlaceholder className="text-lg" />
      )}
    </button>
  );
};

export default LikeButton;
