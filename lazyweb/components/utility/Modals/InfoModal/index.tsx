import Modal from "@/components/shared/Modal";
import { useAllResources } from "@/hooks/Zustand";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaRedditAlien,
  FaWhatsapp,
  FaXing,
} from "react-icons/fa";

const SocialShare = ({ url, title, summary }: SocialShareProps) => {
  const shareData = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} ${url}`
    )}`,
    x: `https://x.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
      summary
    )}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
  };

  const shareIcons = [
    { name: "Facebook", icon: FaFacebookF, color: "bg-blue-600" },
    { name: "WhatsApp", icon: FaWhatsapp, color: "bg-green-500" },
    { name: "X", icon: FaXing, color: "bg-black" },
    { name: "LinkedIn", icon: FaLinkedinIn, color: "bg-blue-700" },
    { name: "Reddit", icon: FaRedditAlien, color: "bg-orange-600" },
  ];

  return (
    <div className="flex w-full justify-center mt-4 space-x-4">
      {shareIcons.map((platform) => (
        <a
          key={platform.name}
          href={
            shareData[platform.name.toLowerCase() as keyof typeof shareData]
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`${platform.color} shadow-custom border border-input text-white p-3 rounded-full transition-transform hover:scale-110`}
        >
          <platform.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
};

type Props = {
  isOpen: boolean;
};

const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
};

const InfoModal = ({ isOpen }: Props) => {
  const router = useRouter();
  const { allResources } = useAllResources();

  const closeModal = () => {
    const { query } = router;
    delete query.id;

    router.replace(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true }
    );
  };

  //TODO: API CALL TO FETCH RESOURCE
  const resource = allResources.find((r) => r._id === router.query.id);

  if (!resource) {
    return <></>;
  }

  return (
    <>
      {isOpen && (
        <Head>
          <title>{resource.title ? "" + resource.title : "Lazyweb"}</title>
          <meta
            name="description"
            content={resource.desc ? resource.desc : "Lazyweb Rocks"}
          />

          {/* Basic Open Graph Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Lazyweb" />
          <meta
            property="og:title"
            content={resource.title ? "" + resource.title : "Lazyweb"}
          />
          <meta
            property="og:description"
            content={resource.desc ? resource.desc : "Lazyweb Rocks"}
          />
          <meta
            property="og:image"
            content={
              resource.image_url ? resource.image_url : "Default Image URL"
            }
          />

          {/* Additional Open Graph Tags */}
          <meta
            property="og:url"
            content={typeof window !== "undefined" ? window.location.href : ""}
          />
          <meta property="og:locale" content="en_US" />

          {/* Twitter-specific meta tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={resource.title ? "" + resource.title : "Lazyweb"}
          />
          <meta
            name="twitter:description"
            content={resource.desc ? resource.desc : "Lazyweb Rocks"}
          />
          <meta
            name="twitter:image"
            content={
              resource.image_url ? resource.image_url : "Default Image URL"
            }
          />
        </Head>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={resource.title ? resource.title : "Resource"}
        className="!w-[60vw]"
      >
        <div className="mt-2 h-[13rem] rounded-2xl overflow-hidden">
          <Image
            src={resource.image_url ? resource.image_url : "Default Image URL"}
            alt={resource.title ? resource.title : "Resource Image"}
            layout="fill"
            className="object-cover !relative"
          />
        </div>
        <div className="w-full mt-2">
          <p className="text-[16px] text-start text-white">{resource.desc}</p>
        </div>
        <div className="mt-2 w-[90%]">
          <p className="text-white mb-[5px] mt-[1rem] ml-[1rem]">Category:</p>
          <span className="text-white rounded-2xl bg-lightGray px-[15px] py-[2px] ml-[1.5rem]">
            {resource.category && capitalize(resource.category)}
          </span>
          <p className="text-white mt-[0.5rem] ml-[1rem]">Tags:</p>
          <div className="flex gap-[0.5rem] flex-wrap mt-[5px] ml-[1.5rem]">
            {resource.tags &&
              resource.tags.map((tag: string) => (
                <span className="text-gray bg-white text-[14px] px-[10px] rounded-2xl py-[2px]">
                  {capitalize(tag)}
                </span>
              ))}
          </div>
        </div>
        <SocialShare
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={resource.title}
          summary={resource.desc}
        />
      </Modal>
    </>
  );
};

export default InfoModal;

type SocialShareProps = {
  url: string;
  title: string;
  summary: string;
};
