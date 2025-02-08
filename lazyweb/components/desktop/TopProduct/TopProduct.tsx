import QRCode from "@/components/shared/QrCode";
import { useTopProduct } from "@/hooks/Zustand";
import { BLUR_IMAGE } from "@/lib/constants";
import { formatUrl } from "@/lib/formatUrl";
import { unFormatUrl } from "@/lib/unFormatUrl";
import Image from "next/image";
import { event } from "nextjs-google-analytics";
import { useEffect, useState } from "react";
import { Link2, Star, ThumbsUp, UserCheck } from "react-feather";
import { FcApproval, FcInfo, FcOpenedFolder } from "react-icons/fc";

const TopProduct = () => {
  const { topProduct } = useTopProduct();
  const [imgData, setImageData] = useState(BLUR_IMAGE);
  const [websiteData, setWebsiteData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: "",
    likes: 0,
  });

  function formatDateDifference(timestamp: number) {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const diff = currentDate.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  }

  useEffect(() => {
    if (topProduct) {
      setImageData(topProduct.image_url);
      const webData = {
        title: topProduct.title || "Not Available",
        description: topProduct.desc || "Not Available",
        image: topProduct.image_url || "Not Available",
        createdAt: formatDateDifference(Number(topProduct.created_at)),
        likes: topProduct.likes || 0,
      };
      setWebsiteData(webData);
    }
  }, [topProduct]);

  const handleVisit = () => {
    if (topProduct) {
      window.open(formatUrl(topProduct?.url), "_blank");
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if ("clipboard" in navigator) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
      return navigator.clipboard.writeText(topProduct?.url!);
    }
  };

  return (
    <div className="lazyweb-top-product">
      <p className="text-white mt-[1rem] ml-[1rem]">Today's Top Product</p>
      <div className="w-[100%] flex justify-center">
        <div className="flex flex-wrap w-[95%] gap-[1.5rem] mt-[1rem]">
          <div
            className={`h-[15rem] transition-all flex items-center justify-center rounded-[10px] w-[24rem] bg-background shadow-custom border border-input`}
          >
            <div className="w-[95%] relative flex flex-col rounded-[5px] justify-end p-[1rem] items-center overflow-hidden h-[14rem]">
              <Image
                src={imgData}
                layout="fill"
                objectFit="cover"
                alt="product image"
                className="absolute top-0 h-full z-[0]"
              />
              <div className="w-full flex z-[1] rounded-lg bg-gray p-[0.5rem] items-center justify-between">
                <div className="flex w-full items-center top_product gap-[5px]">
                  <FcOpenedFolder />
                  <p className="max-w-[85%] text-white truncate">
                    {topProduct?.url
                      ? unFormatUrl(topProduct?.url)
                      : "Not Available"}
                  </p>
                  <FcApproval />
                </div>
              </div>
              <button
                title={`Visit ${
                  topProduct?.url
                    ? topProduct?.url.length > 20
                      ? topProduct?.url.substring(0, 17) + "..."
                      : topProduct?.url
                    : "Not Available"
                }`}
                onClick={() => {
                  event("visit-website", {
                    category: "top-product",
                    action: "visit-website",
                    label: topProduct?.url,
                  });
                  handleVisit();
                }}
                className="w-full h-[2.5rem] z-[1] rounded-[10px] mt-[0.6rem] bg-altGray text-white"
              >
                View Website
              </button>
            </div>
          </div>
          <div className="flex max-w-[calc(100%-26rem)] flex-col flex-grow">
            <div className="flex flex-wrap flex-grow gap-[1.5rem]">
              <div className="h-[8.5rem] flex-grow flex items-center justify-center bg-[#0d0d0e] border-[5px] border-altGray rounded-[10px]">
                <div className="w-[90%] flex flex-col gap-[15px] h-[75%]">
                  <div className="flex gap-[10px]">
                    <Link2 className="text-lightGray scale-[0.6]" />
                    <div className="flex gap-[5px] items-center">
                      <p className="text-white">Link:</p>
                      <a
                        href={
                          topProduct?.url
                            ? formatUrl(topProduct?.url)
                            : "Not Available"
                        }
                        target="_blank"
                        className="text-[#7d9ddb] transition-all truncate text-[14px]"
                      >
                        {unFormatUrl(topProduct?.url || "")
                          ? unFormatUrl(topProduct?.url || "").length > 20
                            ? unFormatUrl(topProduct?.url || "").substring(
                                0,
                                17
                              ) + "..."
                            : unFormatUrl(topProduct?.url || "")
                          : "Not Available"}
                      </a>
                      <button
                        className="text-white scale-[0.7] transition-all  duration-150 ml-[-5px] "
                        onClick={() => {
                          event("copy-link", {
                            category: "top-product",
                            action: "copy-link",
                            label: topProduct?.url,
                          });
                          copyToClipboard();
                        }}
                      >
                        {isCopied ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-6 h-6 text-green-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 5.25a2.25 2.25 0 00-2.012-2.238A2.25 2.25 0 0013.75 1h-1.5a2.25 2.25 0 00-2.238 2.012c-.875.092-1.6.686-1.884 1.488H11A2.5 2.5 0 0113.5 7v7h2.25A2.25 2.25 0 0018 11.75v-6.5zM12.25 2.5a.75.75 0 00-.75.75v.25h3v-.25a.75.75 0 00-.75-.75h-1.5z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M3 6a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V7a1 1 0 00-1-1H3zm6.874 4.166a.75.75 0 10-1.248-.832l-2.493 3.739-.853-.853a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.154-.114l3-4.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-6 h-6 text-[#5a5b5d] "
                          >
                            <path
                              fillRule="evenodd"
                              d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-1.402-.791 2.252 2.252 0 011.913-1.576A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z"
                              clipRule="evenodd"
                            />
                            <path d="M3.5 6A1.5 1.5 0 002 7.5v9A1.5 1.5 0 003.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L8.44 6.439A1.5 1.5 0 007.378 6H3.5z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-[10px]">
                    <Star className="text-lightGray scale-[0.6]" />
                    <div className="flex gap-[5px] items-center">
                      <p className="text-white">Likes:</p>
                      <p className="text-[#7d9ddb] mt-[3px] text-[14px]">
                        {websiteData.likes}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full gap-[10px]">
                    <div className="">
                      <UserCheck className="text-lightGray scale-[0.6]" />
                    </div>
                    <div className="flex gap-[5px] w-full items-center">
                      <p className="text-white">Added:</p>
                      <p className="text-[#7d9ddb] w-[50%] truncate text-[14px]">
                        {websiteData.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                title={`Scan QR code to visit ${
                  topProduct?.url
                    ? topProduct?.url.length > 20
                      ? topProduct?.url.substring(0, 17) + "..."
                      : topProduct?.url
                    : "Not Available"
                }`}
                className="h-[8.5rem] gap-[4px] product-of-day flex flex-col items-center justify-center w-[8.5rem] bg-[#0d0d0e] rounded-[10px]"
              >
                <QRCode
                  url={
                    topProduct?.url
                      ? formatUrl(topProduct?.url)
                      : "Not Available"
                  }
                  height={120}
                  width={120}
                  imageMargin={1}
                  margin={1}
                />
              </div>
              <div className="h-[8.5rem] border-[5px] border-altGray gap-[4px] product-of-day flex flex-col items-center justify-center w-[8.5rem] bg-[#0d0d0e] rounded-[10px]">
                <p className="w-[6rem] font-[600] text-center text-white">
                  Product of the Day
                </p>
                <ThumbsUp className="text-[#fff] scale-[1.2] h-[2rem]" />
              </div>
            </div>
            <div
              className={` transition-all px-[2rem] flex items-center justify-center h-[5rem] rounded-[10px] mt-[1.5rem] border-[5px] border-altGray bg-[#0d0d0e]`}
            >
              <div className="flex w-full items-center">
                <div className="flex items-center w-full gap-4">
                  <FcInfo className="text-[24px]" />
                  <p className="text-white w-full">{websiteData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProduct;
