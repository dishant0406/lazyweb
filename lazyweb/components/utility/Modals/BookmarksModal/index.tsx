import ResourceCard from "@/components/desktop/ResourceCard";
import MobileResourceCard from "@/components/mobile/MobileResourceCard";
import Modal, { ModalFooter } from "@/components/shared/Modal";
import { Resource, useUserData } from "@/hooks/Zustand";
import { useRouter } from "next/router";
import { event } from "nextjs-google-analytics";
import { useState } from "react";
import { bulkBookmark } from "../../api";
import { errorToast, promiseToast, successToast } from "../../toast";

type Props = {
  isOpen: boolean;
  setIsOpen: (argo: boolean) => void;
  resources: Resource[] | undefined;
};

const BookmarkModal = ({ isOpen, setIsOpen, resources }: Props) => {
  const router = useRouter();
  const { session } = useUserData();
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    const { query } = router;
    delete query.bookmark;

    router.replace(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true }
    );
  };

  const bookmarkAll = async () => {
    setLoading(true);
    try {
      await promiseToast(
        bulkBookmark(resources?.map((e) => e._id) || []),
        "Saved",
        {
          errorMessage: "Something went wrong!",
          loadingText: "Saving Resource...",
          onSuccess: (data) => {
            if (data.success) {
              successToast("Bookmarked all resources!");
              closeModal();
              setLoading(false);
            }
          },
        }
      );
    } catch (err) {
      errorToast("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        className="md:max-w-[60vw] max-w-full"
        isOpen={isOpen}
        title="Shared Resources"
        onClose={closeModal}
        footer={
          <ModalFooter className="w-full flex justify-end">
            {session?.id && (
              <button
                type="button"
                disabled={loading}
                className="md:inline-flex hidden justify-center px-4 py-1 text-base font-medium bg-[#0d0d0e] border-altGray border-[2px]  rounded-md shadow-sm text-white hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0 "
                onClick={() => {
                  event("save-all", {
                    category: "bookmark",
                    action: "save-all",
                    label: "save-all",
                  });
                  bookmarkAll();
                }}
              >
                {loading ? "Saving..." : "Save All"}
              </button>
            )}
          </ModalFooter>
        }
      >
        <div className="mt-4 md:flex hidden flex-wrap gap-[10px]">
          {resources &&
            resources.map((e) => {
              return (
                <ResourceCard
                  key={e._id}
                  resource={e}
                  description={e.desc}
                  title={e.title}
                  image={e.image_url}
                  url={e.url}
                />
              );
            })}
        </div>

        <div className="flex flex-wrap justify-center mt-4 md:hidden ">
          {resources &&
            resources.map((e) => {
              return (
                <div className="scale-90" key={e._id}>
                  <MobileResourceCard key={e._id} resource={e} />
                </div>
              );
            })}
        </div>
      </Modal>
    </>
  );
};

export default BookmarkModal;
