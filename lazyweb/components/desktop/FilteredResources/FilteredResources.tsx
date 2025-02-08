import {
  useFilterUsingCategoriesArray,
  useFilterUsingTagsArray,
} from "@/hooks/Zustand";
import { ResourceCard } from "components";

type Props = {};

const FilteredResources = (props: Props) => {
  const { filteredResources } = useFilterUsingCategoriesArray();
  const { filteredResources: filteredTagsResources } =
    useFilterUsingTagsArray();

  return (
    <div>
      <p className="text-[18px] text-white mt-[1rem] ml-[1rem]">
        Filtered Resources:{" "}
        {filteredResources.length || filteredTagsResources.length}{" "}
        {filteredResources.length > 1 || filteredTagsResources.length > 1
          ? "results"
          : "result"}
      </p>
      <div
        className={`relative w-[100%] transition-all duration-300 flex justify-center`}
      >
        <div className="ml-[2rem] w-[95%] flex justify-start gap-[2vw] flex-wrap my-[1rem]">
          {filteredResources.map((e) => {
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
          {filteredTagsResources.map((e) => {
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
      </div>
    </div>
  );
};

export default FilteredResources;
