import {
  approveResource,
  getRefetchImage,
  rejectResource,
} from "@/components/utility/api";
import PublishModal from "@/components/utility/Modals/PublishModal";
import QrCodeModal from "@/components/utility/Modals/QRCodeModal";
import { promiseToast } from "@/components/utility/toast";
import {
  Resource,
  useAllCategory,
  useAllResources,
  useAllTags,
  useSelectedTab,
  useSetBookmark,
  useSetLikes,
  useUserData,
} from "@/hooks/Zustand";
import { formatUrl } from "@/lib/formatUrl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  InfoButton,
  QrCodeButton,
} from "./components/ActionButton";
import AdminActions from "./components/AdminActions";
import BookmarkButton from "./components/BookmarkButton";
import { EditButton } from "./components/EditButton";
import LikeButton from "./components/LikeButton";
import PublishOverlay from "./components/PublisherOverlay";
import ResourceImage from "./components/ResourceImage";

const ResourceCard = ({
  url,
  title,
  description,
  image: res_image,
  resource: currResource,
}: Props) => {
  const [resource, setResource] = useState<Resource>(currResource);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    publish: false,
    info: false,
    qr: false,
    update: false,
  });
  const [image, setImage] = useState<string>(res_image);
  const [loadingImage, setLoadingImage] = useState(false);

  const router = useRouter();
  const formattedUrl = formatUrl(url);
  const { session } = useUserData();
  const { selectedTab } = useSelectedTab();
  const { setBookmark } = useSetBookmark();
  const { setLikes } = useSetLikes();
  const { setAllResources, loading } = useAllResources();
  const { setAllCategories } = useAllCategory();
  const { setAllTags } = useAllTags();

  useEffect(() => {
    getBookMarked();
    getLikes();
  }, [resource, session]);

  const getBookMarked = async () => {
    const bookmarked = resource?.bookmarked_by.includes(session?.id!);
    setIsBookmarked(bookmarked);
  };

  const getLikes = async () => {
    //check if the user has liked the resource
    const liked = resource?.liked_by?.includes(session?.id!);
    setIsLiked(liked);
  };

  const refetchImage = async () => {
    try {
      setLoadingImage(true);
      await promiseToast(getRefetchImage(resource?._id), "Image updated!", {
        errorMessage: "Failed to update image",
        onSuccess: (data) => {
          setImage(data.data.image_url);
          setIsModalOpen({ ...isModalOpen, update: false });
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleBookMark = async () => {
    const res = await setBookmark(resource?._id);
    if (res) {
      setResource(res);
    }
  };

  const handleLike = async () => {
    const res = await setLikes(resource?._id);
    if (res) {
      setResource(res);
    }
  };

  const handleApproveOrReject = async (btnType: string) => {
    try {
      if (btnType === "approve") {
        await promiseToast(
          approveResource(resource?._id),
          "Resource approved!",
          {
            errorMessage: "Failed to approve resource",
            loadingText: "Approving Resource...",
            onSuccess: () => {
              setAllResources("publish");
              setAllCategories();
              setAllTags();
            },
          }
        );
      } else {
        await promiseToast(
          rejectResource(resource?._id),
          "Resource rejected!",
          {
            errorMessage: "Failed to reject resource",
            loadingText: "Rejecting Resource...",
            onSuccess: () => {
              setAllResources("publish");
              setAllCategories();
              setAllTags();
            },
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
      className="w-72 relative transition overflow-hidden shadow-custom border-input h-68 border  rounded-xl"
    >
      <div className="relative">
        <ResourceImage title={title} image={image} />

        {resource.created_by_list.includes(session?.id!) &&
          !resource.isPublicAvailable &&
          !resource.isAvailableForApproval && (
            <PublishOverlay
              onPublish={() =>
                setIsModalOpen({ ...isModalOpen, publish: true })
              }
              isHovered={isHovered}
            />
          )}

        {session?.isAdmin &&
          resource.isAvailableForApproval &&
          selectedTab === "publish" && (
            <AdminActions
              onApprove={() => handleApproveOrReject("approve")}
              onReject={() => handleApproveOrReject("reject")}
              isHovered={isHovered}
            />
          )}
      </div>

      <div className="w-72 h-24 -mt-0.5 flex flex-col ml-4 justify-center">
        <div className="flex gap-2 items-center">
          {/* Edit button and title */}
          {(resource.created_by === session?.id || session?.isAdmin) && (
            <EditButton onRefetchImage={refetchImage} loading={loadingImage} />
          )}
          <div className="text-white truncate w-4/5 text-base font-medium">
            {title}
          </div>
        </div>

        <div className="text-white/60 w-[90%] text-sm">
          {description?.slice(0, 55)}
          {description?.length > 55 && "....."}
        </div>
      </div>

      {/* Action buttons */}
      {session && (
        <BookmarkButton isBookmarked={isBookmarked} onClick={handleBookMark} />
      )}
      {session && resource.isPublicAvailable && (
        <LikeButton isLiked={isLiked} onClick={handleLike} />
      )}

      {/* External link and info buttons */}
      <ExternalLink onVisit={() => {}} url={formattedUrl} title={title} />
      <InfoButton
        onClick={() => {
          router.replace(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                id: resource._id,
              },
            },
            undefined,
            { shallow: true }
          );
        }}
      />
      <QrCodeButton
        onClick={() => setIsModalOpen({ ...isModalOpen, qr: true })}
      />

      <QrCodeModal
        url={url}
        isOpen={isModalOpen.qr}
        setIsOpen={() => setIsModalOpen({ ...isModalOpen, qr: false })}
      />
      <PublishModal
        id={resource._id}
        isOpen={isModalOpen.publish}
        setIsOpen={() => setIsModalOpen({ ...isModalOpen, publish: false })}
        title={title}
        url={url}
      />
    </div>
  );
};

type Props = {
  url: string;
  title: string;
  description: string;
  image: string;
  resource: Resource;
};

export default ResourceCard;
