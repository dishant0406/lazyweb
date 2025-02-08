import { CodeBlock } from "@/components/shared/Micro";
import { event } from "nextjs-google-analytics";
import { FiShare2 } from "react-icons/fi";
import { IoQrCode } from "react-icons/io5";

interface ShareButtonsProps {
  fullUrl: string;
  sessionId: string;
  onOpenQrCode: () => void;
}

export const ShareButtons = ({
  fullUrl,
  sessionId,
  onOpenQrCode,
}: ShareButtonsProps) => {
  const shareUrl = `${fullUrl}?bookmark=${sessionId}`;

  const handleShare = () => {
    event("share-link", {
      category: "bookmark",
      action: "share-link",
      label: "share-link",
    });
    navigator.share({
      title: "Bookmarked Resources",
      url: shareUrl,
    });
  };

  const handleQrCode = () => {
    event("open-qr-code", {
      category: "bookmark",
      action: "open-qr-code",
      label: "open-qr-code",
    });
    onOpenQrCode();
  };

  return (
    <div className="w-full mt-4 flex gap-4 justify-end px-12">
      <CodeBlock
        className="border shadow-custom border-input"
        prefix="#"
        code={shareUrl}
      />
      <button
        onClick={handleShare}
        className="px-4 py-2 rounded border shadow-custom border-input text-white text-sm"
      >
        Share
        <FiShare2 className="inline ml-2 text-lg text-white" />
      </button>
      <button
        onClick={handleQrCode}
        className="px-4 py-2 rounded border shadow-custom border-input text-white text-sm"
      >
        <IoQrCode className="inline text-lg text-white" />
      </button>
    </div>
  );
};
