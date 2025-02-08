interface PublishOverlayProps {
  onPublish: () => void;
  isHovered: boolean;
}

const PublishOverlay = ({ onPublish, isHovered }: PublishOverlayProps) => {
  return (
    <div className="w-full z-[1] absolute top-0 left-0 transition-all flex items-center justify-center duration-500 hover:bg-gray/40 h-40 rounded-t-lg">
      <button
        onClick={onPublish}
        className={`text-white hover:scale-105 ${
          isHovered ? "opacity-100" : "opacity-0"
        } transition-all z-[2] px-4 py-1 text-base bg-[#1c64ec] rounded-full`}
      >
        Publish
      </button>
    </div>
  );
};

export default PublishOverlay;
