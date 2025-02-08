import { FcInfo } from "react-icons/fc";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoQrCode } from "react-icons/io5";

interface ExternalLinkProps {
  url: string;
  title: string;
  onVisit: () => void;
}

export const ExternalLink = ({ url, title, onVisit }: ExternalLinkProps) => (
  <a
    title={`Visit ${title}`}
    onClick={(e) => {
      e.stopPropagation();
      onVisit();
    }}
    href={url}
    target="_blank"
    rel="noreferrer"
    className="text-white hover:scale-105 transition-all absolute bottom-2.5 right-2.5 px-1.5 py-0.5 text-xs bg-altGray rounded-lg"
  >
    <HiOutlineExternalLink className="text-lg text-white inline-block" />
  </a>
);

interface InfoButtonProps {
  onClick: () => void;
}

export const InfoButton = ({ onClick }: InfoButtonProps) => (
  <FcInfo
    onClick={onClick}
    className="text-lg absolute bottom-24 right-1.5 hover:scale-110 cursor-pointer transition-all"
  />
);

interface QrCodeButtonProps {
  onClick: () => void;
}

export const QrCodeButton = ({ onClick }: QrCodeButtonProps) => (
  <button
    onClick={onClick}
    className="h-8 w-8 cursor-pointer flex items-center justify-center rounded-full absolute bottom-24 left-1.5 bg-[rgba(32,33,36,0.5)]"
  >
    <IoQrCode className="text-lg text-white" />
  </button>
);
