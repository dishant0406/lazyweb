type Props = {};
import { Tabs } from "@/components/shared/Micro";
import {
  useAllResources,
  useLoginModal,
  useSelectedTab,
  useUserData,
} from "hooks/Zustand";
import { useEffect, useState } from "react";

const ResourceListBar = (props: Props) => {
  const { session } = useUserData();
  const { setSelectedTab, selectedTab } = useSelectedTab();
  const { setAllResources } = useAllResources();
  const { setIsLoginModalOpen } = useLoginModal();
  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: "All Resources",
      slug: "all",
      selected: true,
    },
    {
      id: 2,
      name: "Saved Resources",
      slug: "saved",
      selected: false,
    },
    {
      id: 3,
      name: "My Resources",
      slug: "my",
      selected: false,
    },
    {
      id: 4,
      name: "Publish",
      slug: "publish",
      selected: false,
      requireAdmin: true,
    },
  ]);

  const selectionHandler = (id: number) => {
    if (session || id === 1) {
      const newTabs = tabs.map((e) => {
        return {
          ...e,
          selected: false,
        };
      });
      newTabs[id - 1].selected = true;
      setSelectedTab(newTabs[id - 1].slug);
      setAllResources(newTabs[id - 1].slug, {
        setActiveTab: setSelectedTab,
      });
      setTabs(newTabs);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [selectedTab]);

  return (
    <div className="w-[100%] sticky mt-2 items-center top-[70px] bg-background z-[2]  lazyweb-resource-list flex justify-start">
      <div className="flex flex-col ml-[1rem] py-2">
        <Tabs
          activeTab={tabs.find((e) => e.slug === selectedTab)?.name || "All"}
          setActiveTab={(id) =>
            selectionHandler(tabs.find((e) => e.name === id)?.id || 1)
          }
          tabs={tabs
            .filter((e) => (session?.isAdmin ? true : !e.requireAdmin))
            .map((e) => e.name)}
        ></Tabs>
      </div>
    </div>
  );
};

export default ResourceListBar;
