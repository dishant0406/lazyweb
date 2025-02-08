import { Resource } from "@/hooks/Zustand";
import { BLUR_IMAGE } from "@/lib/constants";
import { formatUrl } from "@/lib/formatUrl";
import { InfoModal, QrCodeModal } from "components";
import Image from "next/image";
import { useRouter } from "next/router";
import { event } from "nextjs-google-analytics";
import { useState } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { IoQrCode } from "react-icons/io5";

type Props = {
  resource: Resource;
};

const MobileResourceCard = ({ resource }: Props) => {
  const [open, setOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const handleGoto = (): void => {
    window.open(formatUrl(resource.url), "_blank");
  };
  const router = useRouter();
  return (
    <div className="w-[11rem] px-[0.5rem] pt-[0.5rem] relative overflow-y-hidden rounded-[10px] overflow-hidden bg-[#0d0d0e]">
      <div className="mb-[1.5rem]">
        <Image
          alt={resource.title}
          height={100}
          width={200}
          layout="fixed"
          placeholder="blur"
          blurDataURL={BLUR_IMAGE} // Base64 encoded or SVG image data
          src={resource.image_url}
          className="rounded-t-[10px]"
        />
        <div
          onClick={() => {
            event("goto-resource", {
              category: resource.category,
              action: "goto-resource",
              label: resource.title,
            });
            handleGoto();
          }}
          style={{ backgroundColor: "rgba(32, 33, 36, 0.5)" }}
          className="h-[2rem] absolute top-[5px] flex items-center justify-center left-[5px] w-[2rem] rounded-full"
        >
          <BiLinkExternal className="text-white" />
        </div>
        <div
          onClick={() => {
            event("open-info", {
              category: resource.category,
              action: "open-info",
              label: resource.title,
            });
            setIsInfoOpen(true);
          }}
          className="h-[2rem] cursor-pointer w-[2rem] flex items-center justify-center rounded-full absolute bottom-[3rem] right-[5px] bg-[rgba(32,33,36,0.5)]"
        >
          <IoQrCode className="text-[18px] text-white" />
        </div>
        <div
          onClick={() => {
            event("open-info", {
              category: resource.category,
              action: "open-info",
              label: resource.title,
            });

            router.replace(
              {
                pathname: "/",
                query: { id: resource._id },
              },
              undefined,
              { shallow: true }
            );
          }}
          style={{ backgroundColor: "rgba(32, 33, 36, 0.5)" }}
          className="h-[2rem] absolute top-[5px] flex items-center justify-center right-[5px] w-[2rem] rounded-full"
        >
          <AiFillInfoCircle className="text-white" />
        </div>
      </div>
      <div className="w-[11rem] mt-[-1rem] flex justify-center my-[10px]">
        <div className="w-[90%]">
          <h1 className="text-white mr-[0.5rem] truncate font-[600]">
            {resource.title}
          </h1>
          <p className="text-white mr-[0.5rem] text-[14px] truncate opacity-80">
            {resource?.desc}
          </p>
        </div>
      </div>
      <InfoModal isOpen={router.query.id === resource._id} />
      <QrCodeModal
        isOpen={isInfoOpen}
        setIsOpen={setIsInfoOpen}
        url={formatUrl(resource.url)}
      />
    </div>
  );
};

export default MobileResourceCard;
