import { InfiniteScroll } from "@/components/shared/Micro";
import { getResources } from "@/components/utility/api";
import { promiseToast } from "@/components/utility/toast";
import { useAllResources } from "@/hooks/Zustand";
import ResourceCard from "../../ResourceCard";
import { EmptyState } from "./EmptyState";

interface ResourceGridProps {
  resources: any[];
  loading: boolean;
  selectedTab: string; // Added selectedTab prop
}

export const ResourceGrid = ({
  resources,
  loading,
  selectedTab,
}: ResourceGridProps) => {
  const { allResources, setAllResources, setMeta, hasMore, cursor } =
    useAllResources();

  if (loading) {
    return (
      <div className="w-full mb-8 flex items-center justify-center">
        <div className="w-16 h-16 border-b-2 rounded-full animate-spin border-lightGray"></div>
      </div>
    );
  }

  if (resources.length === 0) {
    return <EmptyState selectedTab={selectedTab} />; // Pass selectedTab to EmptyState
  }

  if (selectedTab === "all") {
    return (
      <div className="ml-12 flex gap-4 flex-wrap mt-8">
        <InfiniteScroll
          next={async () => {
            console.log("fetching more resources");
            await promiseToast(getResources(30, cursor), "", {
              onSuccess: ({ data }) => {
                setAllResources("all", {
                  resources: [...allResources, ...data.resources],
                });

                setMeta({
                  cursor: data.nextCursor,
                  totalResources: data.totalResources,
                  hasMore: data.hasMore,
                });
              },
            });
          }}
          threshold={1}
          isLoading={false}
          hasMore={hasMore}
        >
          {allResources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              description={resource.desc}
              title={resource.title}
              image={resource.image_url}
              url={resource.url}
            />
          ))}
        </InfiniteScroll>
      </div>
    );
  }

  return (
    <div className="ml-12 flex gap-4 flex-wrap mt-8">
      {resources.map((resource) => (
        <ResourceCard
          key={resource._id}
          resource={resource}
          description={resource.desc}
          title={resource.title}
          image={resource.image_url}
          url={resource.url}
        />
      ))}
    </div>
  );
};
