import { Switch } from "@/components/shared/Micro";
import {
  useAllResources,
  useGetPendingResources,
  useSelectedTab,
  useUserData,
} from "@/hooks/Zustand";
import { QrCodeModal, ResourceListBar } from "components";
import { useEffect, useState } from "react";
import { ResourceGrid } from "./components/ResourceGrid";
import { ShareButtons } from "./components/ShareButton";

const ResourceList = () => {
  const { allResources: resources, loading } = useAllResources();
  const { isPendingSelected, setIsPendingSelected } = useGetPendingResources();
  const { selectedTab } = useSelectedTab();
  const { session } = useUserData();
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.origin);
    }
  }, []);

  return (
    <div>
      <ResourceListBar />

      {selectedTab === "saved" && (
        <ShareButtons
          fullUrl={fullUrl}
          sessionId={session?.id || ""}
          onOpenQrCode={() => setIsQrCodeModalOpen(true)}
        />
      )}

      {selectedTab === "my" && (
        <div className="w-full text-white mt-4 flex gap-4 justify-end px-12">
          Only Unpublished Resources
          <Switch
            checked={isPendingSelected}
            onChange={() => setIsPendingSelected(!isPendingSelected)}
          ></Switch>
        </div>
      )}

      <div
        className={`relative w-full transition-all duration-300 ${
          loading ? "animate-pulse" : ""
        } justify-center`}
      >
        <ResourceGrid
          selectedTab={selectedTab}
          resources={resources}
          loading={loading}
        />
      </div>

      <QrCodeModal
        isOpen={isQrCodeModalOpen}
        setIsOpen={setIsQrCodeModalOpen}
        url={`${fullUrl}?bookmark=${session?.id}`}
      />
    </div>
  );
};

export default ResourceList;
